import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Loader } from '@skbkontur/react-ui';
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

const trimTime = (t) => (t ? String(t).slice(0, 5) : null);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await MainApi.getOneEvent(id);
        setEvent(res);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные события');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <PageContainer maxWidth="800px">
        <div className="event-details__loader">
          <Loader active type="big" caption="Загрузка данных события..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer maxWidth="800px">
        <div className="event-details__error">
          <h3>Ошибка</h3>
          <p>{error || 'Событие не найдено'}</p>
          <Button onClick={() => navigate('/events')} use="default">Вернуться к списку</Button>
        </div>
      </PageContainer>
    );
  }

  const startTime = trimTime(event.startTime);
  const endTime = trimTime(event.endTime);
  const timeRange = startTime
    ? (endTime ? `${startTime} — ${endTime}` : startTime)
    : null;

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={event.title}
        subtitle="Детали мероприятия"
        actions={
          <div className="event-details__header-actions">
            <Button onClick={() => navigate('/events')} use="default">
              Назад
            </Button>
            <Button use="primary" onClick={() => navigate(`/events/${id}/edit`)}>
              Редактировать
            </Button>
          </div>
        }
      />

      <div style={{ marginTop: '1.5rem' }}>
        {/* Основные данные */}
        <div className="event-details__card">
          <h3 className="event-details__card-title">Основная информация</h3>
          <div className="event-details__grid">
            <div className="event-details__field">
              <span className="event-details__label">Статус</span>
              <span className="event-details__value">
                <span className={`events-status-badge events-status-badge--${event.status}`}>
                  {STATUS_LABELS[event.status] || event.status}
                </span>
              </span>
            </div>

            <div className="event-details__field">
              <span className="event-details__label">Контрагент</span>
              <span className="event-details__value">
                {event.Contractor?.companyName || (
                  <span className="event-details__empty">—</span>
                )}
              </span>
            </div>

            <div className="event-details__field">
              <span className="event-details__label">Дата события</span>
              <span className="event-details__value">{formatDate(event.eventDate)}</span>
            </div>

            <div className="event-details__field">
              <span className="event-details__label">Время</span>
              <span className="event-details__value">
                {timeRange || <span className="event-details__empty">—</span>}
              </span>
            </div>

            <div className="event-details__field">
              <span className="event-details__label">Место проведения</span>
              <span className="event-details__value">
                {event.location || <span className="event-details__empty">—</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Заметки */}
        <div className="event-details__card">
          <h3 className="event-details__card-title">Заметки</h3>
          <div className="event-details__notes">
            {event.notes ? (
              <p className="event-details__notes-text">{event.notes}</p>
            ) : (
              <p className="event-details__notes-placeholder">Нет дополнительных заметок.</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default EventDetails;
