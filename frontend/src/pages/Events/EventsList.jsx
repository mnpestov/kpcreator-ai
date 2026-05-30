import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';

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



  return (
    <PageContainer maxWidth="1200px">
      <PageHeader
        title="События"
        subtitle="Управление событиями и мероприятиями"
        actions={
          <button className="proto-btn proto-btn-primary" onClick={() => navigate('/events/new')}>
            Создать событие
          </button>
        }
      />

      <div className="events-list__filter-bar">
        <form onSubmit={handleSearchSubmit} className="events-list__search-form">
          <input
            className="events-list__search-input"
            placeholder="Поиск по названию или месту..."
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
        <div className="events-list__loader">
          <div className="proto-loader"></div>
          <p style={{ marginTop: '16px', color: '#666' }}>Загрузка событий...</p>
        </div>
      ) : error ? (
        <div className="events-list__error">
          <p>{error}</p>
          <button className="proto-btn proto-btn-secondary" onClick={() => fetchEvents(search)}>Повторить попытку</button>
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
            <button className="proto-btn proto-btn-secondary" onClick={handleResetSearch}>Показать все</button>
          )}
        </div>
      ) : (
        <div className="events-stream">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="event-card"
              onClick={() => navigate(`/events/${ev.id}`)}
            >
              <div className="event-card__identity">
                <div className="event-card__title" title={ev.title}>{ev.title}</div>
                <div className="event-card__date">{formatDate(ev.eventDate)}</div>
              </div>

              <div className="event-card__context">
                <div className="event-card__contractor" title={ev.Contractor?.companyName || '—'}>
                  {ev.Contractor?.companyName || '—'}
                </div>
                <div className="event-card__location" title={`${ev.eventPlace || '—'} • Гостей: ${ev.countOfPerson || '—'}`}>
                  {ev.eventPlace || '—'} • Гостей: {ev.countOfPerson || '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default EventsList;
