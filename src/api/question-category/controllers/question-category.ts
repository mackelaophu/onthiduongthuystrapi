import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::question-category.question-category',
  ({ strapi }) => ({
    // GET /api/question-categories/custom
    async customAction(ctx) {
      // Ví dụ: trả luôn toàn bộ category, có thể populate questions nếu cần
      const data = await strapi.entityService.findMany(
        'api::question-category.question-category',
        {
          populate: ['questions'], // bỏ nếu không cần
        }
      );

      ctx.body = data;
    },
  })
);