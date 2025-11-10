import { factories } from '@strapi/strapi';
import crypto from 'node:crypto';

export default factories.createCoreController(
  'api::invite-code.invite-code',
  ({ strapi }) => ({
    async redeem(ctx) {
      const { code } = ctx.request.body as { code?: string };

      if (!code) {
        return ctx.badRequest('Code is required');
      }

      // 1. Tìm invite theo code, chưa redeem + populate access_code
      const invites = await strapi.entityService.findMany(
        'api::invite-code.invite-code',
        {
          filters: { code },
          populate: { access_code: true },
          limit: 1,
        }
      );

      const invite = invites[0] as any;

      // Không tồn tại hoặc đã redeem rồi
      if (!invite) {
        return ctx.notFound('Invalid or already used code');
      }

      const access = invite.access_code; // đã populate ở trên
      const now = new Date();

      // 2. Check hết hạn / không active / quá số lần redeem
      const isExpired =
        !access ||
        access.isActive === false ||
        (access.validFrom && new Date(access.validFrom) > now) ||
        (access.validTo && new Date(access.validTo) < now) ||
        (typeof access.maxRedeem === 'number' &&
          typeof access.redeemedCount === 'number' &&
          access.redeemedCount >= access.maxRedeem);

      // Nếu invite đã redeem hoặc access đã hết hạn → trả lỗi, không tạo JWT
      if (invite.redeemed || isExpired) {
        return ctx.badRequest('CODE_ALREADY_REDEEMED_OR_EXPIRED', {
          message: 'Mã invite đã được sử dụng hoặc đã hết hạn',
          data: {
            redeemed: !!invite.redeemed,
            expired: isExpired,
          },
        });
      }

      // 3. Tìm user theo username = code (nếu đã tạo trước)
      let user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { username: code } });

      // 4. Nếu chưa có thì tạo mới user Strapi
      if (!user) {
        const email = `${code}@invite.local`;
        const password = crypto.randomUUID();

        user = await strapi.db
          .query('plugin::users-permissions.user')
          .create({
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
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id });

      // 6. Cập nhật invite: đánh dấu đã dùng + lưu jwt
      await strapi.db
        .query('api::invite-code.invite-code')
        .update({
          where: { id: invite.id },
          data: {
            redeemed: true,
            jwt, // nếu không muốn lưu thì xóa dòng này
          },
        });

      // 7. Tăng redeemedCount cho Access Code (nếu có)
      if (access?.id) {
        await strapi.db
          .query('api::access-code.access-code')
          .update({
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
  })
);
