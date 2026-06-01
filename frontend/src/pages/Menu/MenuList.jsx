import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import './Menu.css';

const CATEGORY_LABELS = {
  eat: 'Еда',
  drink: 'Напитки',
};

const getWeightDisplay = (weight, category) => {
  if (weight === null || weight === undefined || weight === '') return '—';
  if (category === 'eat') return `${weight} г`;
  if (category === 'drink') return `${weight} мл`;
  return weight;
};

const MenuList = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuItems = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await MainApi.getMenuItems(query);
      setMenuItems(res);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить меню');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMenuItems(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    fetchMenuItems('');
  };

  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="Меню / Блюда"
        subtitle="Справочник позиций для КП"
        actions={
          <button className="proto-btn proto-btn-primary" onClick={() => navigate('/menu/new')}>
            Добавить позицию
          </button>
        }
      />

      <div className="menu-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="menu-list__search-form">
          <input
            className="menu-list__search-input"
            placeholder="Поиск по названию или категории..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="proto-btn proto-btn-secondary">Найти</button>
          {search && (
            <button type="button" className="proto-btn proto-ghost-btn" onClick={handleResetSearch}>Сбросить</button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="menu-list__loader">
          <div className="proto-loader"></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Загрузка меню...</p>
        </div>
      ) : error ? (
        <div className="menu-list__error">
          <p>{error}</p>
          <button className="proto-btn proto-btn-secondary" onClick={() => fetchMenuItems(search)}>Повторить попытку</button>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="menu-list__empty">
          <h3>Позиции меню не найдены</h3>
          <p>
            {search
              ? 'Попробуйте изменить запрос.'
              : 'Добавьте первую позицию, нажав кнопку «Добавить позицию».'}
          </p>
          {search && (
            <button className="proto-btn proto-btn-secondary" onClick={handleResetSearch}>Показать все</button>
          )}
        </div>
      ) : (
        <div className="menu-stream">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="menu-card"
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              <div className="menu-card__identity">
                <div className="menu-card__title" title={item.title}>
                  {item.title}
                </div>
                <div className="menu-card__category">
                  {CATEGORY_LABELS[item.category] || item.category || '—'}
                </div>
              </div>
              <div className="menu-card__context">
                <div className="menu-card__price">
                  {item.price !== null && item.price !== undefined ? `${item.price} ₽` : '—'}
                </div>
                <div className="menu-card__weight">
                  {getWeightDisplay(item.weight, item.category)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default MenuList;
