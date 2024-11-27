import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import SideNavBar from '../../Components/SideNavBar/SideNavBar';
import Header from '../../Components/Header/Header';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <SideNavBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ marginLeft: isSidebarOpen ? '256px' : '0', transition: 'margin-left 0.3s ease', padding: '20px' }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default Home;
