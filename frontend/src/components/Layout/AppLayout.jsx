import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from '../Header/Header';
import Confetti from '../Festive/Confetti';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  const isFestive = process.env.REACT_APP_FESTIVE_MODE === 'false';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Lock body scroll while mobile navigation drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className={`app-layout ${isFestive ? 'app-layout--festive' : ''}`}>
      {isFestive && <Confetti />}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="app-layout__container">
        <Header onBurgerClick={toggleSidebar} />
        <div className="app-layout__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
