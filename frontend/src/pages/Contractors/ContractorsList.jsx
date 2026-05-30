import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import './Contractors.css';

const ContractorsList = () => {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContractors = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await MainApi.getContractors(query);
      setContractors(res);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список контрагентов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleSearchChange = (val) => {
    setSearch(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContractors(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    fetchContractors('');
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Вы уверены, что хотите удалить контрагента "${name}"?`);
    if (!confirmed) return;

    try {
      await MainApi.deleteContractor(id);
      setContractors((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении контрагента');
    }
  };

  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="Справочник контрагентов"
        subtitle="Управление базой деловых партнеров и клиентов"
        actions={
          <button className="proto-btn proto-btn-primary" onClick={() => navigate('/contractors/new')}>
            Добавить контрагента
          </button>
        }
      />

      <div className="contractors-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="contractors-list__search-form">
          <input
            className="contractors-list__search-input"
            placeholder="Поиск по компании или контактному лицу..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <button type="submit" className="proto-btn proto-btn-secondary">Найти</button>
          {search && (
            <button type="button" className="proto-btn proto-ghost-btn" onClick={handleResetSearch}>Сбросить</button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="contractors-list__loader">
          <div className="proto-loader"></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Загрузка данных...</p>
        </div>
      ) : error ? (
        <div className="contractors-list__error">
          <p>{error}</p>
          <button className="proto-btn proto-btn-secondary" onClick={() => fetchContractors(search)}>Повторить попытку</button>
        </div>
      ) : contractors.length === 0 ? (
        <div className="contractors-list__empty">
          <h3>Контрагенты не найдены</h3>
          <p>Попробуйте изменить запрос или создайте нового контрагента.</p>
          {search && (
            <button className="proto-btn proto-btn-secondary" onClick={handleResetSearch}>Показать всех</button>
          )}
        </div>
      ) : (
        <div className="contractors-stream">
          {contractors.map((c) => (
            <div 
              key={c.id} 
              className="contractor-card"
              onClick={() => navigate(`/contractors/${c.id}`)}
            >
              <div className="contractor-card__identity">
                <div className="contractor-card__title" title={c.companyName}>
                  {c.companyName}
                </div>
              </div>

              <div className="contractor-card__context">
                <div className="contractor-card__person" title={c.contactPerson || '—'}>
                  {c.contactPerson || '—'}
                </div>
                <div className="contractor-card__contacts" title={`${c.phone || '—'} • ${c.email || '—'}`}>
                  {c.phone || '—'} • {c.email || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default ContractorsList;
