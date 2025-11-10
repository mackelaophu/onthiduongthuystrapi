export default {
  routes: [
    {
      method: 'GET',
      path: '/question-categories/custom',
      handler: 'question-category.customAction',
      config: {
        auth: false, // hoặc true tuỳ em
      },
    },
  ],
};
