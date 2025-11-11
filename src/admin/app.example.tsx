// ./src/admin/app.tsx
import InviteToolsPage from './extensions/pages/InviteToolsPage';

export default {
  register(app: any) {
    app.addMenuLink({
      to: '/invite-tools',
      icon: app.icons.Download,
      intlLabel: {
        id: 'invite-tools.menu.label',
        defaultMessage: 'Invite Tools',
      },
      Component: InviteToolsPage,
      permissions: [], // để ai cũng truy cập được
    });
  },
};
