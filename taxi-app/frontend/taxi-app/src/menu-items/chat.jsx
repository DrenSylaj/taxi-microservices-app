// assets
import { LoginOutlined, ProfileOutlined, WechatOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  WechatOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const chat = {
  id: 'chat',
  title: 'Communicate',
  type: 'group',
  children: [
    {
      id: 'chat1',
      title: 'Chat',
      type: 'item',
      url: '/chat',
      icon: icons.WechatOutlined,
      target: false
    }
  ]
};

export default chat;
