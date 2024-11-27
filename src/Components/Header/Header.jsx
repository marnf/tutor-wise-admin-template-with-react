import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <Navbar bg="light"  className='w-full '>
      <Navbar.Brand href="#home">My Brand</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
          <Nav.Link as={Link} to="/user-list">User List</Nav.Link>
          <Nav.Link as={Link} to="/tutor-request">Tutor Request</Nav.Link>
          <Nav.Link as={Link} to="/tutor-list">Tutor List</Nav.Link>
        </Nav>
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
            right: '10px',
          }}
        >
          <MenuOutlined />
        </button>
      )}
    </Navbar>
  );
};

export default Header;
