import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { MenuOutlined } from '@ant-design/icons';
import { LuLogOut } from "react-icons/lu";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { decryptData } from '../../EncryptedPage';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal state

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

    if (user && user.user_type) {
      setUserType(user.user_type);
      setUserId(user.user_id);
    }
  }, []);

  const handleLogOut = () => {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
      console.log('User data has been removed from localStorage');
      window.location.reload(); 
    } else {
      console.log('No item found with the key: user');
    }
  };

  // Modal open/close functions
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleDelete = () => {
    handleLogOut();
    handleCloseDeleteModal();
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="shadow-md">
        <div className="container flex justify-between items-center py-2">
          {/* Sidebar Menu Button (Visible only when Sidebar is hidden) */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-xl text-gray-700 hover:text-blue-500 transition duration-300 ease-in-out lg:block"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'absolute',
                left: '10px',
              }}
            >
              <MenuOutlined />
            </button>
          )}

          {/* Right-aligned section with user info and logout button */}
          <Navbar.Collapse id="basic-navbar-nav" className="lg:flex lg:justify-between lg:w-auto flex-grow">
            <div className="flex items-center ml-auto space-x-4">
              {userType && (
                <>
                  <span className="text-lg font-semibold text-gray-700">{userType}</span>
                  <span className="text-lg font-semibold text-gray-700">{userId}</span>
                  <LuLogOut
                    onClick={handleOpenDeleteModal} // Open modal on click
                    size={25}
                    color="black"
                    className="transition ease-in-out delay-250 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                  />
                </>
              )}
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>

      {/* Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}  maxWidth="sm" fullWidth  >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <p className='text-nowrap'>Are you sure you want to log out?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
