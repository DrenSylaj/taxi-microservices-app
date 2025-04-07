// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const test = {
  id: 'group-test',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'test',
      title: 'Test',
      type: 'item',
      url: '/test/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default test;
