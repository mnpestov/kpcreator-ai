import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Loader } from '@skbkontur/react-ui';
import './Menu.css';

const CATEGORY_LABELS = {
  eat: 'Еда',
  drink: 'Напитки',
  organisation: 'Организация',
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

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Вы уверены, что хотите удалить позицию "${title}"?`);
    if (!confirmed) return;
    try {
      await MainApi.deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении позиции меню');
    }
  };

  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="Меню / Блюда"
        subtitle="Справочник позиций для КП"
        actions={
          <Button use="primary" onClick={() => navigate('/menu/new')}>
            Добавить позицию
          </Button>
        }
      />

      <div className="menu-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="menu-list__search-form">
          <Input
            placeholder="Поиск по названию или категории..."
            value={search}
            onValueChange={setSearch}
            width="320px"
          />
          <Button type="submit" use="default">Найти</Button>
          {search && (
            <Button onClick={handleResetSearch} use="text">Сбросить</Button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="menu-list__loader">
          <Loader active type="big" caption="Загрузка меню..." />
        </div>
      ) : error ? (
        <div className="menu-list__error">
          <p>{error}</p>
          <Button onClick={() => fetchMenuItems(search)} use="default">Повторить попытку</Button>
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
            <Button onClick={handleResetSearch} use="default">Показать все</Button>
          )}
        </div>
      ) : (
        <div className="menu-table-wrapper">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Категория</th>
                <th>Выход (вес/объем)</th>
                <th>Цена, ₽</th>
                <th>Статус</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td
                    className="menu-table__title"
                    onClick={() => navigate(`/menu/${item.id}`)}
                  >
                    {item.title}
                  </td>
                  <td>{CATEGORY_LABELS[item.category] || item.category || '—'}</td>
                  <td>{getWeightDisplay(item.weight, item.category)}</td>
                  <td>{item.price !== null && item.price !== undefined ? item.price : '—'}</td>
                  <td>
                    <span className={`menu-status-badge menu-status-badge--${item.active}`}>
                      {item.active ? 'Активен' : 'Архив'}
                    </span>
                  </td>
                  <td className="menu-table__actions">
                    <button
                      className="menu-table__action-btn"
                      onClick={() => navigate(`/menu/${item.id}`)}
                      title="Просмотреть"
                    >
                      👁
                    </button>
                    <button
                      className="menu-table__action-btn"
                      onClick={() => navigate(`/menu/${item.id}/edit`)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      className="menu-table__action-btn menu-table__action-btn--delete"
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Удалить"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
};

export default MenuList;
