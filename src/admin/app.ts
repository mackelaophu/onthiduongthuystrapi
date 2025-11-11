// src/admin/app.ts
import type { StrapiApp } from '@strapi/admin/strapi-admin';
import { Download } from '@strapi/icons'; // dùng icon trực tiếp

const config = {
  // Các ngôn ngữ dùng trong admin
  locales: ['en', 'vi'],

  // Override text cho tiếng Việt
  translations: {
    vi: {
      // Menu & tiêu đề chung
      'Content Manager': 'Quản lý nội dung',
      'New entry': 'Bản ghi mới',
      'Search': 'Tìm kiếm',
      'Filters': 'Bộ lọc',
      'No content found': 'Chưa có dữ liệu',
      'Entries': 'Bản ghi',
      'Collection Types': 'Kiểu dữ liệu',
      'Single Types': 'Kiểu đơn',

      // Màn list + create entry
      'Create new entry': 'Tạo bản ghi mới',
      'Create an entry': 'Tạo bản ghi',
      Draft: 'Nháp',
      Published: 'Đã xuất bản',
      Publish: 'Xuất bản',
      Save: 'Lưu',
      'Add or create a relation': 'Thêm hoặc tạo liên kết',
      TRUE: 'ĐÚNG',
      FALSE: 'SAI',
    },
  },
};

export default {
  register(app: StrapiApp) {
    app.addMenuLink({
      to: '/invite-tools',
      icon: Download,
      intlLabel: {
        id: 'invite-tools.menu.label',
        defaultMessage: 'Invite Tools',
      },
      // ⚠️ Strapi v5: Component phải là async import
      Component: async () => import('./extensions/pages/InviteToolsPage'),
      permissions: [], // để ai cũng truy cập được
    });
  },

  bootstrap() {},

  config,
};