import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Textarea, Loader } from '@skbkontur/react-ui';
import './Events.css';

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Черновик' },
  { value: 'Approved', label: 'Согласовано' },
  { value: 'Preparation', label: 'Подготовка' },
  { value: 'Scheduled', label: 'Запланировано' },
  { value: 'Completed', label: 'Завершено' },
  { value: 'Cancelled', label: 'Отменено' },
];

const EMPTY_FORM = {
  title: '',
  contractorId: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  location: '',
  status: 'Draft',
  notes: '',
};

const EventForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [contractors, setContractors] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load contractors for dropdown
  useEffect(() => {
    MainApi.getContractors()
      .then(setContractors)
      .catch((err) => console.error('Ошибка загрузки контрагентов:', err));
  }, []);

  // Load event data when editing
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      setFetching(true);
      try {
        const res = await MainApi.getOneEvent(id);
        setForm({
          title: res.title || '',
          contractorId: res.contractorId != null ? String(res.contractorId) : '',
          eventDate: res.eventDate || '',
          startTime: res.startTime || '',
          endTime: res.endTime || '',
          location: res.location || '',
          status: res.status || 'Draft',
          notes: res.notes || '',
        });
      } catch (err) {
        console.error(err);
        alert('Не удалось загрузить данные события');
        navigate('/events');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Название события обязательно';
    if (!form.eventDate) next.eventDate = 'Дата события обязательна';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        contractorId: form.contractorId ? Number(form.contractorId) : null,
        eventDate: form.eventDate,
        startTime: form.startTime || null,
        endTime: form.endTime || null,
        location: form.location || null,
        status: form.status,
        notes: form.notes || null,
      };
      if (isEdit) {
        await MainApi.updateEvent(id, payload);
        navigate(`/events/${id}`);
      } else {
        const created = await MainApi.createEvent(payload);
        navigate(`/events/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении события');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer maxWidth="800px">
        <div className="event-form__loader">
          <Loader active type="big" caption="Загрузка данных..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={isEdit ? 'Редактирование события' : 'Создание события'}
        subtitle={isEdit ? 'Изменение данных мероприятия' : 'Регистрация нового события'}
      />

      <form className="event-form" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        {/* Основная информация */}
        <div className="event-form__card">
          <h3 className="event-form__card-title">Основная информация</h3>
          <div className="event-form__grid">
            {/* Название */}
            <div className="event-form__field event-form__field--full">
              <label className="event-form__label event-form__label--required">Название</label>
              <Input
                width="100%"
                value={form.title}
                placeholder="Корпоратив «Лето 2026»"
                onValueChange={(val) => handleChange('title', val)}
                error={!!errors.title}
              />
              {errors.title && (
                <span className="event-form__error-message">{errors.title}</span>
              )}
            </div>

            {/* Контрагент */}
            <div className="event-form__field event-form__field--full">
              <label className="event-form__label">Контрагент</label>
              <select
                className="event-form__select"
                value={form.contractorId}
                onChange={(e) => handleChange('contractorId', e.target.value)}
              >
                <option value="">— Не выбран —</option>
                {contractors.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Дата */}
            <div className="event-form__field">
              <label className="event-form__label event-form__label--required">Дата события</label>
              <Input
                width="100%"
                type="date"
                value={form.eventDate}
                onValueChange={(val) => handleChange('eventDate', val)}
                error={!!errors.eventDate}
              />
              {errors.eventDate && (
                <span className="event-form__error-message">{errors.eventDate}</span>
              )}
            </div>

            {/* Статус */}
            <div className="event-form__field">
              <label className="event-form__label">Статус</label>
              <select
                className="event-form__select"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Время начала */}
            <div className="event-form__field">
              <label className="event-form__label">Время начала</label>
              <Input
                width="100%"
                type="time"
                value={form.startTime}
                onValueChange={(val) => handleChange('startTime', val)}
              />
            </div>

            {/* Время окончания */}
            <div className="event-form__field">
              <label className="event-form__label">Время окончания</label>
              <Input
                width="100%"
                type="time"
                value={form.endTime}
                onValueChange={(val) => handleChange('endTime', val)}
              />
            </div>

            {/* Место */}
            <div className="event-form__field event-form__field--full">
              <label className="event-form__label">Место проведения</label>
              <Input
                width="100%"
                value={form.location}
                placeholder="Ресторан «Арбат», Москва"
                onValueChange={(val) => handleChange('location', val)}
              />
            </div>
          </div>
        </div>

        {/* Заметки */}
        <div className="event-form__card">
          <h3 className="event-form__card-title">Заметки</h3>
          <div className="event-form__field">
            <label className="event-form__label">Дополнительные сведения</label>
            <Textarea
              width="100%"
              rows={5}
              value={form.notes}
              placeholder="Особенности мероприятия, требования, контакты..."
              onValueChange={(val) => handleChange('notes', val)}
            />
          </div>
        </div>

        <div className="event-form__actions">
          <Button
            onClick={() => navigate(isEdit ? `/events/${id}` : '/events')}
            disabled={loading}
            use="default"
          >
            Отмена
          </Button>
          <Button
            type="submit"
            use="primary"
            loading={loading}
            disabled={loading}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default EventForm;
