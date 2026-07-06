import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@skbkontur/react-ui';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/const';
import logo from '../../images/logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const { login, tgNeedsBind, tgInitDataRaw, setTgNeedsBind, setTgInitDataRaw } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ tel: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Очищаем телефон от маски перед отправкой (оставляем только цифры)
      const cleanTel = form.tel.replace(/\D/g, '');
      const endpoint = tgNeedsBind ? '/auth/telegram/bind' : '/auth/login';
      const payload = { tel: cleanTel, password: form.password };
      if (tgNeedsBind && tgInitDataRaw) payload.initData = tgInitDataRaw;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ошибка авторизации');

      // Очищаем временные состояния при успешной авторизации/привязке
      if (tgNeedsBind) {
        setTgNeedsBind(false);
        setTgInitDataRaw(null);
      }

      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Брендинг */}
        <div className="auth-branding">
          <img className="auth-logo" src={logo} alt="KpCreator" />
          <h2 className="auth-brand-name">KpCreator</h2>
          <span className="auth-subtitle">Вход в систему</span>
        </div>

        {/* Форма авторизации */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="tel">Телефон</label>
            <Input
              width="100%"
              type="tel"
              id="tel"
              name="tel"
              data-testid="login-tel"
              placeholder="+7 (999) 123-45-67"
              disabled={loading}
              required
              mask="+7 (999) 999-99-99"
              maskChar="_"
              value={form.tel}
              onValueChange={(val) => setForm((prev) => ({ ...prev, tel: val }))}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Пароль</label>
            <Input
              width="100%"
              type="password"
              id="password"
              name="password"
              data-testid="login-password"
              placeholder="••••••••"
              value={form.password}
              disabled={loading}
              onValueChange={(val) => setForm((prev) => ({ ...prev, password: val }))}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <Button
              width="100%"
              use="primary"
              type="submit"
              data-testid="login-submit-button"
              loading={loading}
              disabled={loading}
            >
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
