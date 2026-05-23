import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Loader } from '@skbkontur/react-ui';
import './Events.css';

const STATUS_LABELS = {
  Draft: 'Черновик',
  Approved: 'Согласовано',
  Preparation: 'Подготовка',
  Scheduled: 'Запланировано',
  Completed: 'Завершено',
  Cancelled: 'Отменено',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
};

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await MainApi.getEvents(query);
      setEvents(res);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список событий');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents(search);
  };

  const handleResetSearch = () => {
    setSearch('');
    fetchEvents('');
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Вы уверены, что хотите удалить событие "${title}"?`);
    if (!confirmed) return;
    try {
      await MainApi.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении события');
    }
  };

  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="События"
        subtitle="Управление событиями и мероприятиями"
        actions={
          <Button use="primary" onClick={() => navigate('/events/new')}>
            Создать событие
          </Button>
        }
      />

      <div className="events-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="events-list__search-form">
          <Input
            placeholder="Поиск по названию или месту..."
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
        <div className="events-list__loader">
          <Loader active type="big" caption="Загрузка событий..." />
        </div>
      ) : error ? (
        <div className="events-list__error">
          <p>{error}</p>
          <Button onClick={() => fetchEvents(search)} use="default">Повторить попытку</Button>
        </div>
      ) : events.length === 0 ? (
        <div className="events-list__empty">
          <h3>События не найдены</h3>
          <p>
            {search
              ? 'Попробуйте изменить запрос.'
              : 'Создайте первое событие, нажав кнопку «Создать событие».'}
          </p>
          {search && (
            <Button onClick={handleResetSearch} use="default">Показать все</Button>
          )}
        </div>
      ) : (
        <div className="events-table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Название</th>
                <th>Контрагент</th>
                <th>Статус</th>
                <th>Место</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{formatDate(ev.eventDate)}</td>
                  <td
                    className="events-table__title"
                    onClick={() => navigate(`/events/${ev.id}`)}
                  >
                    {ev.title}
                  </td>
                  <td className="events-table__truncate">
                    {ev.Contractor?.companyName || (
                      <span className="events-table__empty-cell">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`events-status-badge events-status-badge--${ev.status}`}>
                      {STATUS_LABELS[ev.status] || ev.status}
                    </span>
                  </td>
                  <td className="events-table__truncate">
                    {ev.location || <span className="events-table__empty-cell">—</span>}
                  </td>
                  <td className="events-table__actions">
                    <button
                      className="events-table__action-btn"
                      onClick={() => navigate(`/events/${ev.id}`)}
                      title="Просмотреть"
                    >
                      👁
                    </button>
                    <button
                      className="events-table__action-btn"
                      onClick={() => navigate(`/events/${ev.id}/edit`)}
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      className="events-table__action-btn events-table__action-btn--delete"
                      onClick={() => handleDelete(ev.id, ev.title)}
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

export default EventsList;
