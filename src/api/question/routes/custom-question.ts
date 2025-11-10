// src/api/question-category/routes/custom-question-category.ts
export default {
  routes: [
    {
      method: 'GET',
      path: '/questions/custom',
      handler: 'question.customAction',
      config: {
        auth: false, // hoặc true nếu muốn bắt buộc login
      },
    },
  ],
};