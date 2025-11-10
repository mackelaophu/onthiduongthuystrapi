// src/api/question-category/routes/custom-question-category.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/question-categories/custom',
      handler: 'question-category.customAction',
      config: {
        auth: false, // hoặc true nếu muốn bắt buộc login
      },
    },
  ],
};