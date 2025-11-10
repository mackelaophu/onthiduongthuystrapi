export default {
  config: {
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

        // Bạn thích dịch gì thêm thì cứ thêm key ở đây
      },
    },
  },
  bootstrap() {},
};
