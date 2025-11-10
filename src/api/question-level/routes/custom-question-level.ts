// src/api/question-category/routes/custom-question-category.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/question-levels/custom',
      handler: 'question-level.customAction',
      config: {
        auth: false, // hoặc true nếu muốn bắt buộc login
      },
    },
  ],
};