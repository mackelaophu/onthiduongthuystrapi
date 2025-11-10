import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::question-category.question-category',
  ({ strapi }) => ({
    async customAction(ctx) {
      const data = await strapi.entityService.findMany(
        'api::question-category.question-category',
        {
          populate: ['questions'], // nếu cần populate
        }
      );

      ctx.body = data;
    },
  })
);