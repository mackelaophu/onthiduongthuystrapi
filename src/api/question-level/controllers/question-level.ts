import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::question-level.question-level',
  ({ strapi }) => ({
    async customAction(ctx) {
      const data = await strapi.entityService.findMany(
        'api::question-level.question-level',
        {
          populate: ['questions', 'exam_sets'], // nếu cần populate
        }
      );

      ctx.body = data;
    },
  })
);