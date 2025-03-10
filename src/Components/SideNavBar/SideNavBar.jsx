import { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../public/images/TutorwiseLogo.png';
import { MdMessage, MdPriceChange, MdSpaceDashboard } from "react-icons/md";
import { PiHandWithdrawLight, PiUserListFill } from "react-icons/pi";
import { PiStudentFill } from "react-icons/pi";
import { FaChalkboardTeacher, FaUserCheck, FaUserTie } from "react-icons/fa";
import { SiGitconnected } from "react-icons/si";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdAirplanemodeInactive } from "react-icons/md";
import { BiSolidSchool } from "react-icons/bi";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdOutlineTask } from "react-icons/md";
import { decryptData } from '../../EncryptedPage';
import '../SideNavBar/SideNavBar.css'
import { BsFileEarmarkPost } from 'react-icons/bs';
import { IoBookmarks } from "react-icons/io5";

const menuItems = [
  {
    key: '/',
    icon: <MdSpaceDashboard size={25} />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '/userlist',
    icon: <PiUserListFill size={25} />,
    label: <Link to="/userlist">User List</Link>,
    role: 1,
  },
  {
    key: '/create-user',
    icon: <FaUserCheck size={25} />,
    label: <Link to="/create-user">Create User</Link>,
    role: 1,
  },
  {
    key: '/student-list',
    icon: <PiStudentFill size={25} />,
    label: <Link to="/student-list">Student List</Link>,
    role: 11,
  },
  {
    key: 'tutor-list',
    icon: <FaChalkboardTeacher size={25} />,
    label: 'Tutor List',
    role: 3,
    children: [
      // { key: '/all-tutor-list', label: <Link to="/all-tutor-list">All Tutor</Link>, role: 3, },
      { key: '/pro-tutor-list', label: <Link to="/pro-tutor-list">Pro Tutor</Link>, role: 3, },
      { key: '/tutor-list', label: <Link to="/tutor-list"> Tutor</Link>, role: 3, },
    ],
  },
  {
    key: '/referrer-list',
    icon: <FaUserTie size={25} />,
    label: <Link to="/referrer-list">Referrer List</Link>,
    role: 11,
  },
  {
    icon: <MdOutlineTask size={25} />,
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
    key: '/connected-list',
    icon: <SiGitconnected size={25} />,
    label: <Link to="/connected-list">Connected List</Link>,
    role: 10,
  },
  {
    key: '/inactive-user',
    icon: <MdAirplanemodeInactive size={25} />,
    label: <Link to="/inactive-user">Inactive Users</Link>,
    role: 12,
  },

  {
    key: 'students-tuition-post',
    icon: <MdOutlinePostAdd size={25} />,
    label: 'Students tuition posts',
    role: 13,
    children: [
      { key: '/students-tuition-posts', label: <Link to="/students-tuition-posts">Students posts</Link>, role: 13, },
      { key: '/students-tuition-status', label: <Link to="/students-tuition-status">Post Status</Link>, role: 13, },
    ],
  },

  {
    key: 'tuition-post',
    icon: <BsFileEarmarkPost size={25} />,
    label: 'Teachers tuition posts',
    role: 6,
    children: [
      { key: '/teachers-tuition-post', label: <Link to="/teachers-tuition-post">Teachers posts</Link>, role: 6, },
      { key: '/teachers-post-status', label: <Link to="/teachers-post-status">Post Status</Link>, role: 6, },
    ],
  },


  {
    key: '/send-message',
    icon: <MdMessage size={25} />,
    label: <Link to="/send-message">Send message</Link>,
    role: 9,
  },
  {
    key: '/withdraw',
    icon: <PiHandWithdrawLight size={25} />,
    label: <Link to="/withdraw">Withdraw</Link>,
    role: 9,
  },
  {
    key: '/hire-tutor',
    icon: <IoBookmarks size={25} />,
    label: <Link to="/hire-tutor">Hire Tutor</Link>,
    role: 9,
  },
  {
    key: 'payment',
    icon: <MdOutlinePayment size={25} />,
    label: 'Payment',
    role: 6,
    children: [
      { key: '/all-payment', label: <Link to="/all-payment">All Payment</Link>, role: 6, },
      { key: '/pro-payment', label: <Link to="/pro-payment">Pro Payment</Link>, role: 6, },
      { key: '/payment', label: <Link to="/payment">Limit Payment</Link>, role: 6, },
    ],
  },
  {
    key: 'subscription',
    icon: <MdPriceChange size={25} />,
    label: 'Subscriptions',
    role: 6,
    children: [
      { key: '/pro-subscription', label: <Link to="/pro-subscription">Pro Subscription</Link>, role: 6, },
      { key: '/limit-subscription', label: <Link to="/limit-subscription">Limit Subscription</Link>, role: 6, },
      { key: '/tuition-percentage', label: <Link to="/tuition-percentage">Tuition Percentage</Link>, role: 6, },
    ],
  },

  {
    key: 'institution',
    icon: <BiSolidSchool size={25} />,
    label: 'Institution',
    role: 4,
    children: [
      { key: '/add-institution', label: <Link to="/add-institution">Add Institution</Link>, role: 4, },
      { key: '/institution-list', label: <Link to="/institution-list">Institution List</Link>, role: 4, },
    ],
  },
  {
    key: 'faq',
    icon: <FaQuestionCircle size={25} />,
    label: 'FAQ',
    role: 5,
    children: [
      { key: '/add-faq', label: <Link to="/add-faq">Add FAQ</Link>, role: 5, },
      { key: '/faq-list', label: <Link to="/faq-list">FAQ List</Link>, role: 5, },
    ],
  },

  {
    key: '/review',
    icon: < MdRateReview size={25} />,
    label: <Link to="/review">Review</Link>,
    role: 7,
  },
  {
    key: '/testimonial',
    icon: <MdReviews size={25} />,
    label: <Link to="/testimonial">Testimonial</Link>,
    role: 8,
  },

];





const SideNavBar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);



  // Filter menu items based on user roles
  useEffect(() => {
    const encryptedUser = localStorage.getItem("user");

    let user;
    if (encryptedUser) {
      try {
        user = decryptData(encryptedUser);
      } catch (error) {
        console.error("Error decrypting user data:", error);
      }
    }
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
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ width: '100px', height: '50px' }}
          />
        </Link>
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
        className="custom-menu"
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


