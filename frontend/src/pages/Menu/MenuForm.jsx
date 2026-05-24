import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Input, Checkbox, Select, Textarea } from '@skbkontur/react-ui';
import './Menu.css';

const TYPE_OPTIONS = [
  ['eat', 'Еда'],
  ['drink', 'Напитки'],
  ['organisation', 'Организация'],
];

const MenuForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'eat',
    weight: '',
    price: '',
    active: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const fetchMenuItem = async () => {
        try {
          const data = await MainApi.getOneMenuItem(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || 'eat',
            weight: data.weight !== null ? data.weight.toString() : '',
            price: data.price !== null ? data.price.toString() : '',
            active: data.active,
          });
        } catch (err) {
          console.error(err);
          setError('Не удалось загрузить данные позиции');
        } finally {
          setLoading(false);
        }
      };
      fetchMenuItem();
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
        category: formData.category || null,
        weight: formData.weight ? parseInt(formData.weight, 10) : null,
        price: formData.price ? parseInt(formData.price, 10) : null,
        active: formData.active,
      };

      if (isEdit) {
        await MainApi.updateMenuItem(id, payload);
      } else {
        await MainApi.createMenuItem(payload);
      }
      navigate('/menu');
    } catch (err) {
      console.error(err);
      setError(isEdit ? 'Ошибка при обновлении позиции' : 'Ошибка при создании позиции');
      setSaving(false);
    }
  };

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={isEdit ? 'Редактирование позиции' : 'Новая позиция меню'}
        subtitle="Заполните информацию о позиции"
        onBack={() => navigate('/menu')}
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Название *</label>
            <Input
              value={formData.title}
              onValueChange={(val) => handleChange('title', val)}
              width="100%"
              placeholder="Например: Сет бургеров"
            />
          </div>

          <div className="menu-form__row">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Описание / Состав</label>
            <Textarea
              value={formData.description}
              onValueChange={(val) => handleChange('description', val)}
              width="100%"
              rows={3}
              placeholder="Описание блюда или состав..."
            />
          </div>

          <div className="menu-form__row" style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Категория</label>
              <Select
                items={TYPE_OPTIONS}
                value={formData.category}
                onValueChange={(val) => handleChange('category', val)}
                width="100%"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Цена (₽)</label>
              <Input
                type="number"
                value={formData.price}
                onValueChange={(val) => handleChange('price', val)}
                width="100%"
                placeholder="0"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Выход (вес/объем)</label>
              <Input
                type="number"
                value={formData.weight}
                onValueChange={(val) => handleChange('weight', val)}
                width="100%"
                placeholder="Укажите число"
                rightIcon={formData.category === 'eat' ? <span style={{color: '#999'}}>г</span> : formData.category === 'drink' ? <span style={{color: '#999'}}>мл</span> : null}
              />
            </div>
          </div>

          <div className="menu-form__row" style={{ marginTop: '24px' }}>
            <Checkbox
              checked={formData.active}
              onValueChange={(val) => handleChange('active', val)}
            >
              Активная позиция (доступна для выбора в КП)
            </Checkbox>
          </div>

          <div className="menu-form__actions">
            <Button use="primary" type="submit" loading={saving}>
              {isEdit ? 'Сохранить изменения' : 'Создать позицию'}
            </Button>
            <Button use="default" onClick={() => navigate('/menu')}>
              Отмена
            </Button>
          </div>
        </form>
      )}
    </PageContainer>
  );
};

export default MenuForm;
