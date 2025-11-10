export default {
  routes: [
    {
      method: 'POST',
      path: '/invite-codes/redeem',
      handler: 'invite-code.redeem',
      config: {
        auth: false,         // cho phép call không cần JWT (vì đây là login)
        policies: [],
        middlewares: [],
      },
    },
  ],
};