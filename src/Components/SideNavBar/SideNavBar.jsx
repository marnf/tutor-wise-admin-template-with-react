import { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../public/images/TutorwiseLogo.png';

const menuItems = [
  {
    key: '/',
    icon: <MailOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '/userlist',
    icon: <MailOutlined />,
    label: <Link to="/userlist">User List</Link>,
    role: 1,
  },
  {
    icon: <AppstoreOutlined />,
    label: 'Tutor Request',
    key: 'tutor-request',
    role: 2, // Unique key for this group
    children: [
      { key: '/pending-tutor-request', label: <Link to="/pending-tutor-request">Pending Tutor Request</Link>, role: 2, },
      { key: '/approved-tutor-request', label: <Link to="/approved-tutor-request">Approved Tutor Request</Link>, role: 2, },
      { key: '/pending-higher-tutor-request', label: <Link to="/pending-higher-tutor-request">Pending Higher Tutor Request</Link>, role: 2, },
      { key: '/approved-higher-tutor-request', label: <Link to="/approved-higher-tutor-request">Approved Higher Tutor Request</Link>, role: 2, },
    ],
  },
  {
    key: 'tutor-list',
    icon: <AppstoreOutlined />,
    label: 'Tutor List',
    role: 3,
    children: [
      { key: '/pro-tutor-list', label: <Link to="/pro-tutor-list">Pro Tutor</Link>, role: 3, },
      { key: '/tutor-list', label: <Link to="/tutor-list"> Tutor</Link>, role: 3, },
    ],
  },
  {
    key: '/tutor-post',
    icon: <MailOutlined />,
    label: <Link to="/tutor-post">Tuition Post</Link>,
    role: 4,
  },
  {
    key: '/inactive-user',
    icon: <MailOutlined />,
    label: <Link to="/inactive-user">Inactive Users</Link>,
    role: 5,
  },
  {
    key: 'institution',
    icon: <AppstoreOutlined />,
    label: 'Institution',
    role: 6,
    children: [
      { key: '/add-institution', label: <Link to="/add-institution">Add Institution</Link>, role: 6, },
      { key: '/institution-list', label: <Link to="/institution-list">Institution List</Link>, role: 6, },
    ],
  },
  {
    key: 'faq',
    icon: <AppstoreOutlined />,
    label: 'FAQ',
    role: 7,
    children: [
      { key: '/add-faq', label: <Link to="/add-faq">Add FAQ</Link>, role: 7, },
      { key: '/faq-list', label: <Link to="/faq-list">FAQ List</Link>, role: 7, },
    ],
  },
  {
    key: 'payment',
    icon: <AppstoreOutlined />,
    label: 'Payment',
    role: 8,
    children: [
      { key: '/pro-payment', label: <Link to="/pro-payment">Pro Payment</Link>, role: 8, },
      { key: '/payment', label: <Link to="/payment">Payment</Link>, role: 8, },
    ],
  },
  {
    key: '/review',
    icon: <MailOutlined />,
    label: <Link to="/review">Review</Link>,
    role: 9,
  },
  {
    key: '/testimonial',
    icon: <MailOutlined />,
    label: <Link to="/testimonial">Testimonial</Link>,
    role: 10,
  },
];





const SideNavBar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);



    // Filter menu items based on user roles
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userRoles = user?.roles || [];
  
      // Filter menu items by roles
      const allowedItems = filterMenuItems(menuItems, userRoles);
      setFilteredItems(allowedItems);
    }, []);

    

    
  // Update openKeys based on the current route
  useEffect(() => {
    const path = location.pathname;

    // Match parent group key based on the current path
    const parentKey = menuItems.find((item) =>
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
          style={{ width: '100px', height: '50px' }} 
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
        items={filteredItems}
      />
    </div>
  );
};




const filterMenuItems = (menuItems, roles) => {
  return menuItems
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenuItems(item.children, roles);
        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }
      // Include items that do not have a role property
      return !item.role || roles.includes(item.role) ? item : null;
    })
    .filter(Boolean);
};



export default SideNavBar;


