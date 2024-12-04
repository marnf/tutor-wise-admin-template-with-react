import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <Navbar bg="light"  className='w-full mt-3'>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      </Navbar.Collapse>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            position: 'absolute',
            left: '10px',
          }}
        >
          <MenuOutlined />
        </button>
      )}
    </Navbar>
  );
};

export default Header;
