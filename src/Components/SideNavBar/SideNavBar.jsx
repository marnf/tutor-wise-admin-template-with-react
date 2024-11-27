import { useState } from 'react';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';

const items = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <MailOutlined />,
    label: <Link to="/user-list">User List</Link>,
  },
  {
    key: '3',
    icon: <AppstoreOutlined />,
    label: 'Tutor Request',
    children: [
      { key: '3-1', label: <Link to="/pending-tutor-request">Pending Tutor Request</Link> },
      { key: '3-2', label: <Link to="/approved-tutor-request">Approved Tutor Request</Link> },
    ],
  },
  {
    key: '4',
    icon: <AppstoreOutlined />,
    label: 'Tutor List',
    children: [
      { key: '3-1', label: <Link to="/pending-tutor-request">Pro Tutor</Link> },
      { key: '3-2', label: <Link to="/approved-tutor-request">Normal Tutor</Link> },
    ],
  },
  
];

const SideNavBar = ({ isSidebarOpen, toggleSidebar }) => {
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
          src="/src/image/Logo.jpg" 
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
        defaultSelectedKeys={['1']}
        style={{ width: '100%' }}
        items={items}
      />
    </div>
  );
};

export default SideNavBar;
