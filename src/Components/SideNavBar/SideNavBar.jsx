import { useState } from 'react';
import { AppstoreOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../../public/images/TutorwiseLogo.png'

const items = [
  {
    key: '1',
    icon: <MailOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <MailOutlined />,
    label: <Link to="/userlist">User List</Link>,
  },
  {
    icon: <AppstoreOutlined />,
    label: 'Tutor Request',
    children: [
      { key: '3-1', label: <Link to="/pending-tutor-request">Pending Tutor Request</Link> },
      { key: '3-2', label: <Link to="/approved-tutor-request">Approved Tutor Request</Link> },
      { key: '3-3', label: <Link to="/pending-higher-tutor-request">Pending Higher Tutor Request</Link> },
      { key: '3-4', label: <Link to="/approved-higher-tutor-request">Approved Higher Tutor Request</Link> },
    ],
  },
  {
    key: '4',
    icon: <AppstoreOutlined />,
    label: 'Tutor List',
    children: [
      { key: '4-1', label: <Link to="/pro-tutor">Pro Tutor</Link> },
      { key: '4-2', label: <Link to="/normal-tutor">Normal Tutor</Link> },
    ],
  },
  {
    key: '5',
    icon: <AppstoreOutlined />,
    label: 'Institution',
    children: [
      { key: '5-1', label: <Link to="/add-institution">Add Institution</Link> },
      { key: '5-2', label: <Link to="/institution-list">Institution List</Link> },
    ],
  },
  {
    key: '6',
    icon: <AppstoreOutlined />,
    label: 'FAQ',
    children: [
      { key: '6-1', label: <Link to="/add-faq">Add FAQ</Link> },
      { key: '6-2', label: <Link to="/faq-list">FAQ List</Link> },
    ],
  },
  {
    key: '7',
    icon: <AppstoreOutlined />,
    label: 'Payment',
    children: [
      { key: '7-1', label: <Link to="/pro-payment">Pro Payment</Link> },
      { key: '7-2', label: <Link to="/normal-payment">Normal Payment</Link> },
    ],
  },
  {
    key: '8',
    icon: <MailOutlined />,
    label: <Link to="/review">Review</Link>,
  },
  {
    key: '9',
    icon: <MailOutlined />,
    label: <Link to="/testimonial">Testimonial</Link>,
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
        defaultSelectedKeys={['1']}
        style={{ width: '100%' }}
        items={items}
      />
    </div>
  );
};

export default SideNavBar;
