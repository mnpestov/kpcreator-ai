import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/const';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Ошибка авторизации');

      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label><br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Пароль: </label><br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;
