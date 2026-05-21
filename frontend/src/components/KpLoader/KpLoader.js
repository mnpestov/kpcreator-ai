import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainApi } from '../../utils/MainApi';
import useKpStore from '../../hooks/useKpStore';

/**
 * Загружает КП по номеру (/kp/:kpNumber), кладёт в глобальный стейт
 * и переводит пользователя на /preview.
 */
export default function KpLoader({ dispatch, setIsNewKp }) {
  const { kpNumber } = useParams();
  const navigate = useNavigate();
  const setFormData = useKpStore((s) => s.setFormData);
  const setListsKp = useKpStore((s) => s.setListsKp);

  useEffect(() => {
    let aborted = false;

    async function load() {
      try {
        if (!kpNumber) return;
        const data = await MainApi.getKp(kpNumber); // ожидается { formData, listsKp }
        if (aborted) return;

        if (data?.formData) {
          setFormData(data.formData);
        }
        if (Array.isArray(data?.listsKp)) {
          // dispatch({ type: 'UPDATE_LISTS', payload: data.listsKp });
          setListsKp(data.listsKp);

        }

        // это уже не новое КП
        if (typeof setIsNewKp === 'function') setIsNewKp(false);

        // на предпросмотр
        navigate('/preview', { replace: true });
      } catch (e) {
        console.error('Не удалось загрузить КП:', e);
        // по желанию: navigate('/') или показать уведомление
      }
    }

    load();
    return () => { aborted = true; };
  }, [kpNumber, dispatch, navigate, setIsNewKp]);

  return <div style={{ padding: 16 }}>Загрузка КП…</div>;
}
