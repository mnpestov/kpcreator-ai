import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { getUserFromToken, saveToken } from '../../utils/auth';
import { MainApi } from '../../utils/MainApi';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    job: '',
    tel: '',
    photo: '',
    password: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        job: user.job || '',
        tel: user.tel || '',
        photo: user.photo || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files?.[0]) {
      handleAvatarUpload(files[0]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `${API_URL}/profile/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const filename = res.data.filename;

      setFormData((prev) => ({
        ...prev,
        photo: filename,
      }));

      setUser((prevUser) => ({
        ...prevUser,
        photo: filename,
      }));
    } catch (e) {
      alert('Ошибка при загрузке аватара');
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(`${API_URL}/profile/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔁 Получаем новый токен с обновлённым photo
      const checkRes = await axios.get(`${API_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (checkRes.data.token) {
        saveToken(checkRes.data.token);
        const updatedUser = await MainApi.getUser();
        setUser(updatedUser.user);
      }

      alert('Профиль обновлён');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Ошибка при обновлении');
    }
  };

  return (
    <div className="container">
      <h2>Личный кабинет</h2>
      {formData.photo && (
        <img
          src={`${API_URL}/static/${formData.photo}`}
          alt="Аватар"
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Имя" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="job" value={formData.job} onChange={handleChange} placeholder="Должность" />
        <input name="tel" value={formData.tel} onChange={handleChange} placeholder="Телефон" />
        <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Текущий пароль" />
        <input name="newPassword" value={formData.newPassword} onChange={handleChange} type="password" placeholder="Новый пароль" />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default Profile;
