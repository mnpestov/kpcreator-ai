import React from 'react';
import './Header.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
// import { Home } from 'lucide-react'; // иконка (можно заменить на любую другую)

const Header = () => {
//   const { user, logout, isAuth } = useContext(AuthContext);
  const { user, logout, isAuth } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="header">
      <div className="header__title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        {/* <Home size={20} style={{ marginRight: 8 }} /> */}
        <strong>KpCreator</strong>
      </div>

      <div className="header__actions">
        <span className="header__user">{user.name}</span>
        {isAuth && (
          <button className="list__button navigation-button" onClick={() => navigate('/profile')}>
            Личный кабинет
          </button>
        )}
        <button className="list__button navigation-button" onClick={logout}>Выйти</button>
      </div>
    </header>
  );
};

export default Header;

