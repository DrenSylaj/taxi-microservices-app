import { lazy } from 'react';

// project imports
import Loadable from '../components/Loadable';
import DashboardLayout from '../layout/Dashboard';
import ChatBody from '../components/chat/ChatBody';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/default')));

// render - color
// const Color = Loadable(lazy(() => import('pages/component-overview/color')));
// const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
// const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/:userId',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'chat',
      element: <ChatBody/>
    }
    // {
    //   path: 'typography',
    //   element: <Typography />
    // },
    // {
    //   path: 'color',
    //   element: <Color />
    // },
    // {
    //   path: 'shadow',
    //   element: <Shadow />
    // },
    // {
    //   path: 'sample-page',
    //   element: <SamplePage />
    // }
  ],
  
};

export default MainRoutes;
