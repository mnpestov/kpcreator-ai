import React from 'react';

export const getStatusObj = (status) => {
  switch (status) {
    case 'sent': return { label: 'Отправлено', className: 'sent' };
    case 'approved': return { label: 'Согласовано', className: 'approved' };
    case 'paid': return { label: 'Оплачено', className: 'paid' };
    case 'draft':
    default:
      return { label: 'Черновик', className: 'draft' };
  }
};

const KpCard = ({ kp, onClick, variant = 'home' }) => {
  const prettyDate = kp.startEvent
    ? new Date(kp.startEvent).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    : (kp.createdAt ? new Date(kp.createdAt).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }) : '');
    
  const statusObj = getStatusObj(kp.status);
  
  const hasTotal = kp.totalAmount !== null && kp.totalAmount !== undefined;
  const totalAmount = hasTotal ? `${Number(kp.totalAmount).toLocaleString('ru-RU')} ₽` : '— ₽';

  return (
    <div
      className="kp-row-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* 1. Identity Block */}
      <div className="kp-card-identity" title={`№ ${kp.kpNumber}`}>
        <div className="kp-number-text">№ {kp.kpNumber}</div>
        <div className="kp-identity-meta">
          <span className={`status-badge ${statusObj.className}`}>
            {statusObj.label}
          </span>
          <div className="kp-date">{prettyDate}</div>
        </div>
      </div>

      {/* 2. Context Block */}
      <div className="kp-card-context">
        {variant !== 'contractor' && (
          <div className="contractor-name" title={kp.contractor?.companyName || '—'}>
            {kp.contractor?.companyName || '—'}
          </div>
        )}
        <div className="event-details" title={`${kp.event?.title || 'Без названия'} • ${kp.eventPlace || kp.listTitle || '—'}`}>
          {kp.event?.title || 'Без названия'} • {kp.eventPlace || kp.listTitle || '—'}
        </div>
      </div>

      {/* 3. Value Block */}
      <div className="kp-card-actions">
        <div className="kp-amount">
          {totalAmount}
        </div>
      </div>
    </div>
  );
};

export default KpCard;
