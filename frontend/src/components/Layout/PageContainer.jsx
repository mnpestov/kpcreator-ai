import React from 'react';
import './PageContainer.css';

const PageContainer = ({ children, maxWidth = '1200px' }) => {
  return (
    <div className="page-container" style={{ '--max-width': maxWidth }}>
      {children}
    </div>
  );
};

export default PageContainer;
