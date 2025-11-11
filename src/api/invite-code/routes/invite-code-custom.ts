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
    {
      method: 'GET',
      path: '/invite-codes/export',
      handler: 'invite-code.exportExcel',
      config: {
        auth: false, // tuỳ bạn
      },
    },

    // 3) IMPORT EXCEL
    {
      method: 'POST',
      path: '/invite-codes/import',
      handler: 'invite-code.importExcel',
      config: {
        auth: false, // hoặc true nếu chỉ admin được import
      },
    },
  ],
};