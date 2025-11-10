import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::question.question',
  ({ strapi }) => ({
    async customAction(ctx) {
      const data = await strapi.entityService.findMany(
        'api::question.question',
        {
          populate: ['level', 'category'], // nếu cần populate
        }
      );

      ctx.body = data;
    },
  })
);