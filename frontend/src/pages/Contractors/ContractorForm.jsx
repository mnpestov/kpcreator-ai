import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Textarea, Loader } from '@skbkontur/react-ui';
import './Contractors.css';

const ContractorForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    const fetchContractor = async () => {
      setFetching(true);
      try {
        const res = await MainApi.getContractor(id);
        setForm({
          companyName: res.companyName || '',
          contactPerson: res.contactPerson || '',
          phone: res.phone || '',
          email: res.email || '',
          notes: res.notes || ''
        });
      } catch (err) {
        console.error(err);
        alert('Не удалось загрузить данные контрагента для редактирования');
        navigate('/contractors');
      } finally {
        setFetching(false);
      }
    };

    fetchContractor();
  }, [id, isEdit, navigate]);

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) {
      newErrors.companyName = 'Название компании обязательно для заполнения';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await MainApi.updateContractor(id, form);
        navigate(`/contractors/${id}`);
      } else {
        await MainApi.createContractor(form);
        navigate('/contractors');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении данных контрагента');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PageContainer maxWidth="800px">
        <div className="contractor-form__loader">
          <Loader active type="big" caption="Загрузка данных для редактирования..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={isEdit ? 'Редактирование контрагента' : 'Добавление контрагента'}
        subtitle={isEdit ? 'Изменение данных делового партнера' : 'Регистрация нового контрагента в справочнике'}
      />

      <form className="contractor-form" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="contractor-form__card">
          <h3 className="contractor-form__card-title">Основная информация</h3>
          <div className="contractor-form__grid">
            <div className="contractor-form__field">
              <label className="contractor-form__label contractor-form__label--required">
                Название компании
              </label>
              <Input
                width="100%"
                value={form.companyName}
                placeholder="ООО КатерингСервис"
                onValueChange={(val) => handleChange('companyName', val)}
                error={!!errors.companyName}
              />
              {errors.companyName && (
                <span className="contractor-form__error-message">{errors.companyName}</span>
              )}
            </div>

            <div className="contractor-form__field">
              <label className="contractor-form__label">
                Контактное лицо
              </label>
              <Input
                width="100%"
                value={form.contactPerson}
                placeholder="Иван Иванов"
                onValueChange={(val) => handleChange('contactPerson', val)}
              />
            </div>

            <div className="contractor-form__field">
              <label className="contractor-form__label">
                Телефон
              </label>
              <Input
                width="100%"
                value={form.phone}
                placeholder="+7 (999) 123-45-67"
                onValueChange={(val) => handleChange('phone', val)}
              />
            </div>

            <div className="contractor-form__field">
              <label className="contractor-form__label">
                Email
              </label>
              <Input
                width="100%"
                value={form.email}
                placeholder="partner@example.com"
                onValueChange={(val) => handleChange('email', val)}
              />
            </div>
          </div>
        </div>

        <div className="contractor-form__card">
          <h3 className="contractor-form__card-title">Дополнительно</h3>
          <div className="contractor-form__field">
            <label className="contractor-form__label">Заметки / Примечания</label>
            <Textarea
              width="100%"
              rows={5}
              value={form.notes}
              placeholder="Дополнительные сведения, реквизиты, особенности работы..."
              onValueChange={(val) => handleChange('notes', val)}
            />
          </div>
        </div>

        <div className="contractor-form__actions">
          <Button
            onClick={() => navigate(isEdit ? `/contractors/${id}` : '/contractors')}
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

export default ContractorForm;
