import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Layout/PageContainer';
import PageHeader from '../../components/Layout/PageHeader';
import { MainApi } from '../../utils/MainApi';
import { Button, Loader } from '@skbkontur/react-ui';
import './Contractors.css';

const ContractorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await MainApi.getContractor(id);
        setContractor(res);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные контрагента');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <PageContainer maxWidth="800px">
        <div className="contractor-details__loader">
          <Loader active type="big" caption="Загрузка данных контрагента..." />
        </div>
      </PageContainer>
    );
  }

  if (error || !contractor) {
    return (
      <PageContainer maxWidth="800px">
        <div className="contractor-details__error">
          <h3>Ошибка</h3>
          <p>{error || 'Контрагент не найден'}</p>
          <Button onClick={() => navigate('/contractors')} use="default">Вернуться к списку</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="800px">
      <PageHeader
        title={contractor.companyName}
        subtitle="Сведения о деловом партнере"
        actions={
          <div className="contractor-details__header-actions">
            <Button onClick={() => navigate('/contractors')} use="default">
              Назад
            </Button>
            <Button use="primary" onClick={() => navigate(`/contractors/${id}/edit`)}>
              Редактировать
            </Button>
          </div>
        }
      />

      <div className="contractor-details__content" style={{ marginTop: '1.5rem' }}>
        {/* Card: Основная информация */}
        <div className="contractor-details__card">
          <h3 className="contractor-details__card-title">Контактная информация</h3>
          <div className="contractor-details__grid">
            <div className="contractor-details__field">
              <span className="contractor-details__label">Компания</span>
              <span className="contractor-details__value">{contractor.companyName}</span>
            </div>

            <div className="contractor-details__field">
              <span className="contractor-details__label">Контактное лицо</span>
              <span className="contractor-details__value">
                {contractor.contactPerson || <span className="contractor-details__empty">—</span>}
              </span>
            </div>

            <div className="contractor-details__field">
              <span className="contractor-details__label">Телефон</span>
              <span className="contractor-details__value">
                {contractor.phone || <span className="contractor-details__empty">—</span>}
              </span>
            </div>

            <div className="contractor-details__field">
              <span className="contractor-details__label">Email</span>
              <span className="contractor-details__value">
                {contractor.email ? (
                  <a href={`mailto:${contractor.email}`} className="contractor-details__link">
                    {contractor.email}
                  </a>
                ) : (
                  <span className="contractor-details__empty">—</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Card: Заметки */}
        <div className="contractor-details__card">
          <h3 className="contractor-details__card-title">Заметки / Примечания</h3>
          <div className="contractor-details__notes">
            {contractor.notes ? (
              <p className="contractor-details__notes-text">{contractor.notes}</p>
            ) : (
              <p className="contractor-details__notes-placeholder">Нет дополнительных заметок о контрагенте.</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContractorDetails;
