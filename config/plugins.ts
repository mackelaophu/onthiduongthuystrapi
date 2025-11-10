export default ({ env }) => ({
  // Plugin users-permissions cần jwtSecret
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },

  // i18n
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'vi',
      locales: ['vi', 'en'], // cần thêm ngôn ngữ nào thì liệt kê ở đây
    },
  },
});
