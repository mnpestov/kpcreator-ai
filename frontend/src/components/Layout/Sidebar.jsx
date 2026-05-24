import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Список КП', path: '/', isPlaceholder: false },
    { label: 'Новое КП', path: '/new', isPlaceholder: false },
    { label: 'Контрагенты', path: '/contractors', isPlaceholder: false },
    { label: 'События', path: '/events', isPlaceholder: false },
    { label: 'Меню', path: '/menu', isPlaceholder: false },
    { label: 'Профиль', path: '/profile', isPlaceholder: false },
    { label: 'Справочники', path: '/directories', isPlaceholder: true },
  ];

  return (
    <>
      {/* Mobile background backdrop - closes sidebar on outside click */}
      <div
        className={`sidebar__backdrop ${isOpen ? 'sidebar__backdrop--visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <strong>KpCreator</strong>
          <button className="sidebar__close-btn" onClick={onClose} aria-label="Закрыть меню">
            &times;
          </button>
        </div>
        <nav className="sidebar__nav">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={idx}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''} ${item.isPlaceholder ? 'sidebar__nav-item--placeholder' : ''}`}
                onClick={() => {
                  if (!item.isPlaceholder) {
                    navigate(item.path);
                    onClose(); // Automatically close mobile sidebar on navigation
                  }
                }}
                disabled={item.isPlaceholder}
              >
                {item.label}
                {item.isPlaceholder && <span className="sidebar__badge">скоро</span>}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
