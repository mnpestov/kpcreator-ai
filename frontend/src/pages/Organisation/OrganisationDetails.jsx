import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { toast } from 'react-toastify';
import './Organisation.css';



const OrganisationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orgItem, setOrganisationItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await MainApi.getOneOrganisation(id);
        setOrganisationItem(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные услуги');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        await MainApi.deleteOrganisation(id);
        navigate('/organisation');
      } catch (err) {
        console.error(err);
        toast.error('Ошибка при удалении услуги');
      }
    }
  };

  if (loading) return <div className="org-details__loader"><div className="proto-loader"></div></div>;
  if (error || !orgItem) return <div className="org-details__error">{error || 'Услуга не найдена'}</div>;

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title="Просмотр услуги"
        subtitle={orgItem.title}
        showBackButton
        onBack={() => navigate('/organisation')}
      />

      <div className="org-details">
        <div className="org-details__section">
          <h3 className="org-details__section-title">Основная информация</h3>
          <div className="org-details__field">
            <span className="org-details__label">Название</span>
            <span className="org-details__value">{orgItem.title}</span>
          </div>

          <div className="org-details__field">
            <span className="org-details__label">Цена</span>
            <span className="org-details__value">
              {orgItem.price !== null && orgItem.price !== undefined ? `${orgItem.price} ₽` : <span className="org-details__empty">—</span>}
            </span>
          </div>
          
          <div className="org-details__field org-details__field--full">
            <span className="org-details__label">Описание</span>
            <span className="org-details__value org-details__value--text">
              {orgItem.description || <span className="org-details__empty">Нет описания</span>}
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />

      <div className="proto-sticky-bar">
        <div className="proto-sticky-content">
          <button className="proto-btn proto-btn-secondary" style={{ color: '#dc2626', borderColor: '#fecaca', backgroundColor: '#fef2f2' }} onClick={handleDelete}>
            Удалить
          </button>
          <button 
            className="proto-btn proto-btn-primary" 
            onClick={() => navigate(`/organisation/${id}/edit`)}
          >
            Редактировать
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default OrganisationDetails;
