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
  redis: {
    enabled: true,
    config: {
      connections: {
        // Tên connection "default" sẽ dùng cho Rest Cache
        default: {
          connection: {
            host: env('REDIS_HOST', '127.0.0.1'),
            port: env.int('REDIS_PORT', 6379),
            db: env.int('REDIS_DB', 0),
            password: env('REDIS_PASSWORD', undefined),
          },
        },
      },
    },
  },

  // 2) Plugin REST Cache dùng provider Redis
  'rest-cache': {
    enabled: true,
    config: {
      provider: {
        name: 'redis',
        options: {
          // Dùng connection "default" bên trên (plugin-redis docs)
          connection: 'default',
          // TTL mặc định (ms) cho các response cache
          ttl: 3600 * 1000, // 1 giờ
        },
      },
      strategy: {
        // Prefix cho key trong Redis (tuỳ chọn)
        keysPrefix: env('REDIS_KEY_PREFIX', 'onthiduongthuy:'),

        // Liệt kê các Content-Type UID muốn cache
        contentTypes: [
          'api::exam-set.exam-set',
          'api::question.question',
          'api::access-code.access-code',
          'api::invite-code.invite-code',
          'api::question-category.question-category',
          'api::question-level.question-level',
          'api::training-center.training-center',
        ],
      },
    },
  },
});
