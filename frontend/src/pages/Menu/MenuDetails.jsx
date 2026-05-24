import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button } from '@skbkontur/react-ui';
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

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const data = await MainApi.getOneMenuItem(id);
        setMenuItem(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные позиции меню');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [id]);

  if (loading) return <PageContainer maxWidth="800px"><p>Загрузка...</p></PageContainer>;
  if (error) return <PageContainer maxWidth="800px"><p style={{ color: 'red' }}>{error}</p></PageContainer>;
  if (!menuItem) return null;

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={menuItem.title}
        subtitle="Детальная информация о позиции меню"
        onBack={() => navigate('/menu')}
        actions={
          <Button use="primary" onClick={() => navigate(`/menu/${menuItem.id}/edit`)}>
            Редактировать
          </Button>
        }
      />

      <div className="menu-details">
        <div className="menu-details__section">
          <h3>Основная информация</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="menu-details__field">
              <span className="menu-details__label">Название</span>
              <span className="menu-details__value">{menuItem.title}</span>
            </div>
            <div className="menu-details__field">
              <span className="menu-details__label">Статус</span>
              <span className={`menu-status-badge menu-status-badge--${menuItem.active}`}>
                {menuItem.active ? 'Активен' : 'Архив'}
              </span>
            </div>
            <div className="menu-details__field">
              <span className="menu-details__label">Категория</span>
              <span className="menu-details__value">
                {CATEGORY_LABELS[menuItem.category] || menuItem.category || <span className="menu-details__empty">—</span>}
              </span>
            </div>
            <div className="menu-details__field">
              <span className="menu-details__label">Выход (вес/объем)</span>
              <span className="menu-details__value">
                {getWeightDisplay(menuItem.weight, menuItem.category)}
              </span>
            </div>
            <div className="menu-details__field">
              <span className="menu-details__label">Цена</span>
              <span className="menu-details__value">
                {menuItem.price !== null && menuItem.price !== undefined ? `${menuItem.price} ₽` : <span className="menu-details__empty">—</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="menu-details__section">
          <h3>Описание / Состав</h3>
          <div className="menu-details__field">
            <span className="menu-details__value" style={{ whiteSpace: 'pre-wrap' }}>
              {menuItem.description || <span className="menu-details__empty">Нет описания</span>}
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MenuDetails;
