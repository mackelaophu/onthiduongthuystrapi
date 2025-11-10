export default {
  routes: [
    {
      method: 'GET',
      path: '/question-categories', // URL của Content API
      handler: 'api::question-category.question-category.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
