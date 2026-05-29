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
  startEvent: '',
  endEvent: '',
  startTimeStartEvent: '',
  endTimeStartEvent: '',
  startTimeEndEvent: '',
  endTimeEndEvent: '',
  eventPlace: '',
  countOfPerson: '',
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
  const [initialForm, setInitialForm] = useState(null);
  const [linkedKpCount, setLinkedKpCount] = useState(0);

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
        const formData = {
          title: res.title || '',
          contractorId: res.contractorId != null ? String(res.contractorId) : '',
          eventDate: res.eventDate || '',
          startTime: res.startTime || '',
          endTime: res.endTime || '',
          startEvent: res.startEvent || res.eventDate || '',
          endEvent: res.endEvent || res.eventDate || '',
          startTimeStartEvent: res.startTimeStartEvent || res.startTime || '',
          endTimeStartEvent: res.endTimeStartEvent || '',
          startTimeEndEvent: res.startTimeEndEvent || '',
          endTimeEndEvent: res.endTimeEndEvent || res.endTime || '',
          countOfPerson: res.countOfPerson || '',
          eventPlace: res.eventPlace || '',
          status: res.status || 'Draft',
          notes: res.notes || '',
        };
        setForm(formData);
        setInitialForm(formData);
        if (res.kps) {
          setLinkedKpCount(res.kps.length);
        }
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
    if (!form.startEvent && !form.eventDate) next.startEvent = 'Дата события обязательна';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); console.log("FORM SUBMIT:", JSON.stringify(form));
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        contractorId: form.contractorId ? Number(form.contractorId) : null,
        eventDate: form.eventDate,
        startTime: form.startTime === '' ? null : form.startTime,
        endTime: form.endTime === '' ? null : form.endTime,
        startEvent: form.startEvent,
        endEvent: form.endEvent,
        startTimeStartEvent: form.startTimeStartEvent === '' ? null : form.startTimeStartEvent,
        endTimeStartEvent: form.endTimeStartEvent === '' ? null : form.endTimeStartEvent,
        startTimeEndEvent: form.startTimeEndEvent === '' ? null : form.startTimeEndEvent,
        endTimeEndEvent: form.endTimeEndEvent === '' ? null : form.endTimeEndEvent,
        countOfPerson: form.countOfPerson === '' ? null : form.countOfPerson,
        eventPlace: form.eventPlace || null,
        status: form.status,
        notes: form.notes || null,
      };
      if (isEdit) {
        await MainApi.updateEvent(id, payload);

        if (initialForm) {
          const isScheduleChanged =
            form.startEvent !== initialForm.startEvent ||
            form.endEvent !== initialForm.endEvent ||
            form.startTimeStartEvent !== initialForm.startTimeStartEvent ||
            form.endTimeStartEvent !== initialForm.endTimeStartEvent ||
            form.startTimeEndEvent !== initialForm.startTimeEndEvent ||
            form.endTimeEndEvent !== initialForm.endTimeEndEvent ||
            form.eventDate !== initialForm.eventDate ||
            form.startTime !== initialForm.startTime ||
            form.endTime !== initialForm.endTime ||
            form.eventPlace !== initialForm.eventPlace;

          if (isScheduleChanged && linkedKpCount > 0) {
            if (window.confirm("Обновить дату/тайминг/адрес в связанных КП?")) {
              await MainApi.propagateEventLogistics(id, payload);
            }
          }
        }

        navigate(`/events/${id}`);
      } else {
        console.log("SENDING TO API", payload); const created = await MainApi.createEvent(payload);
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
                data-testid="event-title"
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

            {/* Количество гостей */}
            <div className="event-form__field event-form__field--full">
              <label className="event-form__label">Кол-во гостей</label>
              <Input
                width="100%"
                type="number"
                value={form.countOfPerson}
                onValueChange={(val) => handleChange('countOfPerson', val)}
                data-testid="event-count-of-person"
              />
            </div>

            {/* Статус */}
            {/* <div className="event-form__field">
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
            </div> */}

            {/* FIRST DAY SCHEDULE */}
            <div className="event-form__field event-form__field--full">
              <h4 style={{ margin: '10px 0 5px', fontSize: '14px', color: '#666' }}>Первый день</h4>
              <div className='event-form__date-time-group'>
                <div>
                  <label className="event-form__label event-form__label--required">Дата</label>
                  <Input
                    width="100%"
                    type="date"
                    value={form.startEvent || form.eventDate}
                    data-testid="event-date"
                    onValueChange={(val) => {
                      handleChange('startEvent', val);
                      if (!form.endEvent) handleChange('endEvent', val);
                    }}
                    error={!!errors.startEvent}
                  />
                  {errors.startEvent && (
                    <span className="event-form__error-message">{errors.startEvent}</span>
                  )}
                </div>
                <div className='event-form__time-group'>
                  <div>
                    <label className="event-form__label">Время начала</label>
                    <Input
                      width="100%"
                      type="time"
                      data-testid="event-start-time-start"
                      value={form.startTimeStartEvent || form.startTime}
                      onValueChange={(val) => handleChange('startTimeStartEvent', val)}
                    />
                  </div>
                  <div>
                    <label className="event-form__label">Время окончания</label>
                    <Input
                      width="100%"
                      type="time"
                      data-testid="event-end-time-start"
                      value={form.endTimeStartEvent}
                      onValueChange={(val) => handleChange('endTimeStartEvent', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* LAST DAY SCHEDULE */}
            <div className="event-form__field event-form__field--full">
              <h4 style={{ margin: '10px 0 5px', fontSize: '14px', color: '#666' }}>Последний день</h4>
              <div className='event-form__date-time-group'>
                <div>
                  <label className="event-form__label">Дата</label>
                  <Input
                    width="100%"
                    type="date"
                    data-testid="event-end-date"
                    value={form.endEvent}
                    onValueChange={(val) => handleChange('endEvent', val)}
                  />
                </div>
                <div className='event-form__time-group'>
                  <div>
                    <label className="event-form__label">Время начала</label>
                    <Input
                      width="100%"
                      type="time"
                      data-testid="event-start-time-end"
                      value={form.startTimeEndEvent}
                      onValueChange={(val) => handleChange('startTimeEndEvent', val)}
                    />
                  </div>
                  <div>
                    <label className="event-form__label">Время окончания</label>
                    <Input
                      width="100%"
                      type="time"
                      data-testid="event-end-time-end"
                      value={form.endTimeEndEvent || form.endTime}
                      onValueChange={(val) => handleChange('endTimeEndEvent', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Место */}
            <div className="event-form__field event-form__field--full">
              <label className="event-form__label">Место проведения</label>
              <Input
                width="100%"
                value={form.eventPlace}
                data-testid="event-eventPlace"
                placeholder="Ресторан «Арбат», Москва"
                onValueChange={(val) => handleChange('eventPlace', val)}
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
            data-testid="event-save-button"
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default EventForm;
