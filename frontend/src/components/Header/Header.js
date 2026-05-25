import React from 'react';
import './Header.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
import { API_BASE_URL } from '../../utils/const';
// import { Home } from 'lucide-react'; // иконка (можно заменить на любую другую)

const Header = ({ onBurgerClick }) => {
  const { user, isAuth } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="header">
      <button className="header__burger" onClick={onBurgerClick} aria-label="Открыть меню">
        <span className="header__burger-line"></span>
        <span className="header__burger-line"></span>
        <span className="header__burger-line"></span>
      </button>

      <div className="header__title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <strong>KpCreator</strong>
      </div>

      <div className="header__actions">
        <div className="header__operator">
          <div className="header__avatar">
            {user.photo ? (
              <img src={`${API_BASE_URL}/static/${user.photo}`} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          <span className="header__user">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

