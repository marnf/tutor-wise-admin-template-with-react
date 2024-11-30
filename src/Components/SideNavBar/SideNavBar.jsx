import { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../public/images/TutorwiseLogo.png';

const items = [
  {
    key: '/',
    icon: <MailOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '/home/userlist',
    icon: <MailOutlined />,
    label: <Link to="/home/userlist">User List</Link>,
  },
  {
    icon: <AppstoreOutlined />,
    label: 'Tutor Request',
    key: 'tutor-request', // Unique key for this group
    children: [
      { key: '/home/pending-tutor-request', label: <Link to="/home/pending-tutor-request">Pending Tutor Request</Link> },
      { key: '/home/approved-tutor-request', label: <Link to="/home/approved-tutor-request">Approved Tutor Request</Link> },
      { key: '/home/pending-higher-tutor-request', label: <Link to="/home/pending-higher-tutor-request">Pending Higher Tutor Request</Link> },
      { key: '/home/approved-higher-tutor-request', label: <Link to="/home/approved-higher-tutor-request">Approved Higher Tutor Request</Link> },
    ],
  },
  {
    key: 'tutor-list',
    icon: <AppstoreOutlined />,
    label: 'Tutor List',
    children: [
      { key: '/home/pro-tutor-list', label: <Link to="/home/pro-tutor-list">Pro Tutor</Link> },
      { key: '/home/tutor-list', label: <Link to="/home/tutor-list"> Tutor</Link> },
    ],
  },
  {
    key: 'institution',
    icon: <AppstoreOutlined />,
    label: 'Institution',
    children: [
      { key: '/home/add-institution', label: <Link to="/home/add-institution">Add Institution</Link> },
      { key: '/home/institution-list', label: <Link to="/home/institution-list">Institution List</Link> },
    ],
  },
  {
    key: 'faq',
    icon: <AppstoreOutlined />,
    label: 'FAQ',
    children: [
      { key: '/add-faq', label: <Link to="/add-faq">Add FAQ</Link> },
      { key: '/faq-list', label: <Link to="/faq-list">FAQ List</Link> },
    ],
  },
  {
    key: 'payment',
    icon: <AppstoreOutlined />,
    label: 'Payment',
    children: [
      { key: '/pro-payment', label: <Link to="/pro-payment">Pro Payment</Link> },
      { key: '/normal-payment', label: <Link to="/normal-payment">Normal Payment</Link> },
    ],
  },
  {
    key: '/review',
    icon: <MailOutlined />,
    label: <Link to="/review">Review</Link>,
  },
  {
    key: '/testimonial',
    icon: <MailOutlined />,
    label: <Link to="/testimonial">Testimonial</Link>,
  },
];

const SideNavBar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  // Update openKeys based on the current route
  useEffect(() => {
    const path = location.pathname;

    // Match parent group key based on the current path
    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === path)
    )?.key;

    if (parentKey) {
      setOpenKeys([parentKey]); // Expand the matched parent group
    }
  }, [location.pathname]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys); // Update open keys when a user interacts
  };

  return (
    <div
      style={{
        width: '256px',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: isSidebarOpen ? '0' : '-256px',
        backgroundColor: '#fff',
        boxShadow: '2px 0px 10px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease',
        overflowY: 'auto',
        zIndex: '999',
      }}
    >
      {/* Logo with Toggle Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: '150px', height: 'auto' }} 
        />
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          <MenuOutlined />
        </button>
      </div>

      {/* Menu Component */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]} // Highlight the current route
        openKeys={openKeys} // Expand the required parent group
        onOpenChange={handleOpenChange} // Update open keys on user interaction
        style={{ width: '100%' }}
        items={items}
      />
    </div>
  );
};

export default SideNavBar;
