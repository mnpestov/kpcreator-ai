import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Loader } from '@skbkontur/react-ui';
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
          <Button use="primary" onClick={() => navigate('/contractors/new')}>
            Добавить контрагента
          </Button>
        }
      />

      <div className="contractors-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="contractors-list__search-form">
          <Input
            placeholder="Поиск по компании или контактному лицу..."
            value={search}
            onValueChange={handleSearchChange}
            width="320px"
          />
          <Button type="submit" use="default">Найти</Button>
          {search && (
            <Button onClick={handleResetSearch} use="text">Сбросить</Button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="contractors-list__loader">
          <Loader active type="big" caption="Загрузка данных..." />
        </div>
      ) : error ? (
        <div className="contractors-list__error">
          <p>{error}</p>
          <Button onClick={() => fetchContractors(search)} use="default">Повторить попытку</Button>
        </div>
      ) : contractors.length === 0 ? (
        <div className="contractors-list__empty">
          <h3>Контрагенты не найдены</h3>
          <p>Попробуйте изменить запрос или создайте нового контрагента.</p>
          {search && (
            <Button onClick={handleResetSearch} use="default">Показать всех</Button>
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
