// assets
import { DashboardOutlined, UpCircleOutlined } from '@ant-design/icons';
// icons
const icons = {
  DashboardOutlined,
  UpCircleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'Kosova',
      title: 'Kosova',
      type: 'item',
      url: '/kosova',
      icon: icons.UpCircleOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
