import { factories } from "@strapi/strapi";
import crypto from "node:crypto";
import ExcelJS from "exceljs";
export default factories.createCoreController(
  "api::invite-code.invite-code",
  ({ strapi }) => ({
    async redeem(ctx) {
      const { code } = ctx.request.body as { code?: string };

      if (!code) {
        return ctx.badRequest("Code is required");
      }

      // 1. Tìm invite theo code, chưa redeem + populate access_code
      const invites = await strapi.entityService.findMany(
        "api::invite-code.invite-code",
        {
          filters: { code },
          populate: { access_code: true },
          limit: 1,
        }
      );

      const invite = invites[0] as any;

      // Không tồn tại hoặc đã redeem rồi
      if (!invite) {
        return ctx.notFound("Invalid or already used code");
      }

      const access = invite.access_code; // đã populate ở trên
      const now = new Date();

      // 2. Check hết hạn / không active / quá số lần redeem
      const isExpired =
        !access ||
        access.isActive === false ||
        (access.validFrom && new Date(access.validFrom) > now) ||
        (access.validTo && new Date(access.validTo) < now) ||
        (typeof access.maxRedeem === "number" &&
          typeof access.redeemedCount === "number" &&
          access.redeemedCount >= access.maxRedeem);

      // Nếu invite đã redeem hoặc access đã hết hạn → trả lỗi, không tạo JWT
      if (invite.redeemed || isExpired) {
        return ctx.badRequest("CODE_ALREADY_REDEEMED_OR_EXPIRED", {
          message: "Mã invite đã được sử dụng hoặc đã hết hạn",
          data: {
            redeemed: !!invite.redeemed,
            expired: isExpired,
          },
        });
      }

      // 3. Tìm user theo username = code (nếu đã tạo trước)
      let user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { username: code } });

      // 4. Nếu chưa có thì tạo mới user Strapi
      if (!user) {
        const email = `${code}@invite.local`;
        const password = crypto.randomUUID();

        user = await strapi.db.query("plugin::users-permissions.user").create({
          data: {
            username: code,
            email,
            password,
            confirmed: true,
            blocked: false,
          },
        });
      }

      // 5. Sinh JWT
      const jwt = await strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      // 6. Cập nhật invite: đánh dấu đã dùng + lưu jwt
      await strapi.db.query("api::invite-code.invite-code").update({
        where: { id: invite.id },
        data: {
          redeemed: true,
          jwt, // nếu không muốn lưu thì xóa dòng này
        },
      });

      // 7. Tăng redeemedCount cho Access Code (nếu có)
      if (access?.id) {
        await strapi.db.query("api::access-code.access-code").update({
          where: { id: access.id },
          data: {
            redeemedCount: (access.redeemedCount ?? 0) + 1,
          },
        });
      }

      // 8. Trả kết quả cho FE
      ctx.body = {
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      };
    },

    // ===================================
    // 2. EXPORT EXCEL
    // ===================================
    async exportExcel(ctx) {
      const invites = await strapi.entityService.findMany(
        "api::invite-code.invite-code",
        {
          populate: ["access_code"],
          limit: 10000, // tuỳ nhu cầu
        }
      );

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Invite Codes");

      // Header: tuỳ format bạn muốn
      sheet.addRow(["Mã truy cập", "Bộ mã truy cập", "Redeemed"]);

      invites.forEach((inv: any) => {
        sheet.addRow([
          inv.code,
          inv.access_code?.code ?? "",
          inv.redeemed ? "TRUE" : "FALSE"
        ]);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      ctx.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      ctx.set(
        "Content-Disposition",
        'attachment; filename="invite-codes.xlsx"'
      );
      ctx.body = buffer;
    },

    // ===================================
    // 3. IMPORT EXCEL
    // ===================================
    async importExcel(ctx) {
      // 1. Lấy file upload
      const anyReq = ctx.request as any;
      const file = anyReq.files?.file;

      if (!file) {
        return ctx.badRequest('No file uploaded (field "file" required)');
      }

      // Strapi v5 (formidable) thường dùng `filepath`, fallback sang `path` cho chắc
      const filePath = (file as any).filepath || file.path;

      if (!filePath) {
        return ctx.badRequest('Cannot determine uploaded file path');
      }

      // 2. Đọc Excel
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      const sheet = workbook.worksheets[0];
      if (!sheet || sheet.rowCount <= 1) {
        return ctx.badRequest('Empty Excel file or no data rows');
      }

      type RowData = {
        code: string;
        accessCode?: string;
        redeemed?: boolean;
        jwt?: string;
      };

      const rows: RowData[] = [];

      // 3. Parse từng dòng trong sheet (bỏ header)
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // bỏ dòng header

        const codeCell = row.getCell(1).value;
        const accessCodeCell = row.getCell(2).value;
        const redeemedCell = row.getCell(3).value;
        const jwtCell = row.getCell(4).value; // có thể undefined nếu file chỉ có 3 cột

        const code = codeCell ? String(codeCell).trim() : '';

        // Không có code thì bỏ qua dòng
        if (!code) return;

        const accessCode = accessCodeCell
          ? String(accessCodeCell).trim()
          : undefined;

        const jwt = jwtCell ? String(jwtCell).trim() : undefined;

        let redeemed: boolean | undefined;
        if (redeemedCell !== null && redeemedCell !== undefined && redeemedCell !== '') {
          const v = String(redeemedCell).toLowerCase();
          redeemed =
            v === 'true' ||
            v === '1' ||
            v === 'yes' ||
            v === 'y' ||
            v === 'x';
        }

        rows.push({ code, accessCode, redeemed, jwt });
      });

      if (rows.length === 0) {
        return ctx.badRequest('No valid rows found in Excel file');
      }

      // 4. Lặp để create / update
      let created = 0;
      let updated = 0;

      for (const row of rows) {
        // 4.1. Tìm access-code nếu có
        let accessId: number | undefined;

        if (row.accessCode) {
          const accessList = await strapi.entityService.findMany(
            'api::access-code.access-code',
            {
              filters: { code: row.accessCode },
              limit: 1,
            }
          );

          const access = accessList[0] as any;
          if (access) {
            accessId = access.id;
          }
        }

        // 4.2. Tìm invite-code theo code
        const existingList = await strapi.entityService.findMany(
          'api::invite-code.invite-code',
          {
            filters: { code: row.code },
            limit: 1,
          }
        );
        const existing = existingList[0] as any | undefined;

        // 4.3. Build data để ghi DB
        const data: any = {
          code: row.code,
        };

        if (typeof row.redeemed === 'boolean') {
          data.redeemed = row.redeemed;
        }

        if (row.jwt && row.jwt.length > 0) {
          data.jwt = row.jwt;
        }

        if (accessId) {
          // nếu field là relation `access_code` (manyToOne)
          data.access_code = accessId;
        }

        // 4.4. Create / update
        if (existing) {
          await strapi.db.query('api::invite-code.invite-code').update({
            where: { id: existing.id },
            data,
          });
          updated++;
        } else {
          await strapi.db.query('api::invite-code.invite-code').create({
            data,
          });
          created++;
        }
      }

      // 5. Trả kết quả
      ctx.body = {
        imported: rows.length,
        created,
        updated,
      };
    },
  })
);
