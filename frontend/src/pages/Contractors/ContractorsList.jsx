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
        <div className="contractors-table-wrapper">
          <table className="contractors-table">
            <thead>
              <tr>
                <th>Компания</th>
                <th>Контактное лицо</th>
                <th>Телефон</th>
                <th>Email</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map((c) => (
                <tr key={c.id}>
                  <td className="contractors-table__company" onClick={() => navigate(`/contractors/${c.id}`)}>
                    {c.companyName}
                  </td>
                  <td>{c.contactPerson || <span className="contractors-table__empty-cell">—</span>}</td>
                  <td>{c.phone || <span className="contractors-table__empty-cell">—</span>}</td>
                  <td>{c.email || <span className="contractors-table__empty-cell">—</span>}</td>
                  <td className="contractors-table__actions">
                    <button
                      className="contractors-table__action-btn"
                      onClick={() => navigate(`/contractors/${c.id}`)}
                      title="Просмотреть"
                    >
                      👁
                    </button>
                    <button
                      className="contractors-table__action-btn"
                      onClick={() => navigate(`/contractors/${c.id}/edit`)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      className="contractors-table__action-btn contractors-table__action-btn--delete"
                      onClick={() => handleDelete(c.id, c.companyName)}
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

export default ContractorsList;
