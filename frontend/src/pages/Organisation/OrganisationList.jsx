import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import './Organisation.css';



const OrganisationList = () => {
  const navigate = useNavigate();
  const [orgItems, setOrganisationItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganisationItems = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await MainApi.getOrganisations(query);
      setOrganisationItems(res);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить меню');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisationItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrganisationItems(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    fetchOrganisationItems('');
  };

  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="Организация"
        subtitle="Справочник услуг для КП"
        actions={
          <button className="proto-btn proto-btn-primary" onClick={() => navigate('/organisation/new')}>
            Добавить услугу
          </button>
        }
      />

      <div className="org-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="org-list__search-form">
          <input
            className="org-list__search-input"
            placeholder="Поиск по названию..."
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
        <div className="org-list__loader">
          <div className="proto-loader"></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Загрузка услуг...</p>
        </div>
      ) : error ? (
        <div className="org-list__error">
          <p>{error}</p>
          <button className="proto-btn proto-btn-secondary" onClick={() => fetchOrganisationItems(search)}>Повторить попытку</button>
        </div>
      ) : orgItems.length === 0 ? (
        <div className="org-list__empty">
          <h3>Услуги не найдены</h3>
          <p>
            {search
              ? 'Попробуйте изменить запрос.'
              : 'Добавьте первую услугу, нажав кнопку «Добавить услугу».'}
          </p>
          {search && (
            <button className="proto-btn proto-btn-secondary" onClick={handleResetSearch}>Показать все</button>
          )}
        </div>
      ) : (
        <div className="org-stream">
          {orgItems.map((item) => (
            <div 
              key={item.id}
              className="org-card"
              onClick={() => navigate(`/organisation/${item.id}`)}
            >
              <div className="org-card__identity">
                <div className="org-card__title" title={item.title}>
                  {item.title}
                </div>
                {item.description && (
                  <div className="org-card__description" title={item.description}>
                    {item.description}
                  </div>
                )}
              </div>
              <div className="org-card__context">
                <div className="org-card__price">
                  {item.price !== null && item.price !== undefined ? `${item.price} ₽` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default OrganisationList;
