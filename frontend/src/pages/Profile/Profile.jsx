import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// import { AuthContext } from '../../context/AuthContext';
import useAuthStore from '../../hooks/useAuthStore';

import { MainApi } from '../../utils/MainApi';
import { saveToken } from '../../utils/auth';
import { profileSchema } from '../../validation/profileSchema';

function Profile() {
  // const { user, setUser } = useContext(AuthContext);
  const { user, setUser } = useAuthStore();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      job: '',
      tel: '',
      password: '',
      newPassword: '',
    },
  });

  // 🔁 Подгружаем данные пользователя
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        job: user.job || '',
        tel: user.tel || '',
        password: '',
        newPassword: '',
      });
    }
  }, [user, reset, setUser]);

  // 🖼️ Загрузка аватара
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
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        photo: res.data.filename,
      }));
    } catch (e) {
      console.error(e);
      alert('Ошибка при загрузке аватара');
    }
  };

  // 💾 Сабмит формы
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('authToken');

      await axios.patch(`${API_URL}/profile/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔁 Обновляем токен
      const checkRes = await axios.get(`${API_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (checkRes.data.token) {
        saveToken(checkRes.data.token);
        const updatedUser = await MainApi.getUser();
        setUser(updatedUser.user);
      }

      alert('Профиль обновлён');
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Ошибка при обновлении');
    }
  };

  return (
    <form className='profile__form form' onSubmit={handleSubmit(onSubmit)}>
      <h2 className='form__title'>Личный кабинет</h2>

      
        {user?.photo && (
          <img
            className='profile__avatar'
            src={`${API_URL}/static/${user.photo}`}
            alt="Аватар"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 16,
            }}
          />
        )}

        <input
          className='profile__input form__input'
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
        />
      

      {/* <form className='profile__form form' onSubmit={handleSubmit(onSubmit)}> */}
        <input className='profile__input form__input' {...register('name')} placeholder="Имя" />
        <p>{errors.name?.message}</p>

        <input className='profile__input form__input' {...register('email')} placeholder="Email" />
        <p>{errors.email?.message}</p>

        <input className='profile__input form__input' {...register('job')} placeholder="Должность" />

        <input className='profile__input form__input' {...register('tel')} placeholder="Телефон" />

        <input
          className='profile__input form__input'
          type="password"
          {...register('password')}
          placeholder="Текущий пароль"
        />

        <input
          className='profile__input form__input'
          type="password"
          {...register('newPassword')}
          placeholder="Новый пароль"
        />
        <p>{errors.newPassword?.message}</p>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      {/* </form>  */}
    </form>
  );
}

export default Profile;
