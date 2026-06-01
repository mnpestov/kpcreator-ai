import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import './Organisation.css';

const OrganisationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'organisation',
    price: '',
    active: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const data = await MainApi.getOneOrganisation(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: 'organisation',
            price: data.price !== null ? data.price.toString() : '',
            active: data.active,
          });
        } catch (err) {
          console.error(err);
          setError('Не удалось загрузить данные услуги');
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id, isEdit]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Поле "Название" обязательно для заполнения');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: 'organisation',
        price: formData.price ? parseInt(formData.price, 10) : null,
        active: formData.active,
      };

      if (isEdit) {
        await MainApi.updateOrganisation(id, payload);
      } else {
        await MainApi.createOrganisation(payload);
      }
      navigate('/organisation');
    } catch (err) {
      console.error(err);
      setError(isEdit ? 'Ошибка при обновлении услуги' : 'Ошибка при создании услуги');
      setSaving(false);
    }
  };

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={isEdit ? 'Редактирование услуги' : 'Новая услуга'}
        subtitle="Заполните информацию об услуге"
        onBack={() => navigate('/organisation')}
      />

      {error && (
        <div style={{ color: 'red', marginBottom: '16px', padding: '12px', background: '#fee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Загрузка данных...</p>
      ) : (
        <form className="menu-form" onSubmit={handleSubmit}>
          <div className="menu-form__row">
            <label className="menu-form__label">Название *</label>
            <input
              className="menu-form__input"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Например: Сет бургеров"
            />
          </div>

          <div className="menu-form__row">
            <label className="menu-form__label">Описание / Состав</label>
            <textarea
              className="menu-form__input"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Описание блюда или состав..."
            />
          </div>

          <div className="menu-form__row menu-form__grid">
            <div style={{ gridColumn: 'span 2' }}>
              <label className="menu-form__label">Цена (₽)</label>
              <input
                className="menu-form__input"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ height: '80px' }} />

          <div className="proto-sticky-bar">
            <div className="proto-sticky-content">
              <button
                type="submit"
                className="proto-btn proto-btn-primary"
                disabled={saving}
              >
                {saving ? 'Сохранение...' : (isEdit ? 'Сохранить изменения' : 'Создать услугу')}
              </button>
            </div>
          </div>
        </form>
      )}
    </PageContainer>
  );
};

export default OrganisationForm;
