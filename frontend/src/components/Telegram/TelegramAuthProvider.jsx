import React, { useEffect, useRef, useState, useContext } from 'react';
import { init, retrieveRawInitData, isTMA } from '@telegram-apps/sdk';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/const';
import { Spinner } from '@skbkontur/react-ui';

const TelegramAuthProvider = ({ children }) => {
  const { login, isAuth, setTgNeedsBind, setTgInitDataRaw } = useContext(AuthContext);
  const [isInitializing, setIsInitializing] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const initStartedRef = useRef(false);

  useEffect(() => {
    const initializeTMA = async () => {
      try {
        const inTMA = await isTMA();
        if (!inTMA) {
          setIsInitializing(false);
          return;
        }

        init();
        const initDataRaw = retrieveRawInitData();
        setTgInitDataRaw(initDataRaw);

        const res = await fetch(`${API_BASE_URL}/auth/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: initDataRaw })
        });

        if (res.ok) {
          const data = await res.json();
          login(data.token);
        } else if (res.status === 404 || res.status === 401 || res.status === 403) {
          // Нет привязки или просрочен токен -> отправляем на обычный вход
          setTgNeedsBind(true);
        } else {
          throw new Error('Backend error');
        }
      } catch (err) {
        console.error('Ошибка инициализации Telegram SDK:', err);
        if (err.message === 'Backend error' || err.name === 'TypeError') {
          // Ошибка fetch (Network Error)
          setErrorStatus('Нет соединения с сервером');
        } else {
          // Сбой самого SDK
          setErrorStatus('Telegram SDK временно недоступен');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    if (!isAuth) {
      if (initStartedRef.current) return;
      initStartedRef.current = true;
      initializeTMA();
    } else {
      setIsInitializing(false);
    }
  }, [isAuth, login, setTgInitDataRaw, setTgNeedsBind]);

  if (errorStatus) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888', fontFamily: 'sans-serif' }}>{errorStatus}</p>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner type="big" caption="Авторизация..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default TelegramAuthProvider;
