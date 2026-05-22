import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import './Profile.css';

// import { AuthContext } from '../../context/AuthContext';
import useAuthStore from '../../hooks/useAuthStore';

import { MainApi } from '../../utils/MainApi';
import { saveToken } from '../../utils/auth';
import { profileSchema } from '../../validation/profileSchema';
import { API_BASE_URL } from '../../utils/const';

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], 'cropped-avatar.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
};

function Profile() {
  // const { user, setUser } = useContext(AuthContext);
  const { user, setUser } = useAuthStore();

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

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCancel = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
  };

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels || !imageSrc) return;
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      await handleAvatarUpload(croppedFile);
    } catch (e) {
      console.error('Error cropping image:', e);
      alert('Ошибка при обрезке изображения');
    } finally {
      setImageSrc(null);
    }
  };

  // 🖼️ Загрузка аватара
  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `${API_BASE_URL}/profile/upload-avatar`,
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

      await axios.patch(`${API_BASE_URL}/profile/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔁 Обновляем токен
      const checkRes = await axios.get(`${API_BASE_URL}/auth/check`, {
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
            src={`${API_BASE_URL}/static/${user.photo}`}
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
          onChange={onFileChange}
        />

        {imageSrc && (
          <div className="crop-modal-overlay">
            <div className="crop-modal-container">
              <h3 className="crop-modal-title">Обрезка аватара</h3>
              <div className="crop-modal-area-wrapper">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="crop-modal-controls">
                <label className="crop-modal-zoom-label">
                  Масштаб:
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-label="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="crop-modal-zoom-slider"
                  />
                </label>
              </div>
              <div className="crop-modal-buttons">
                <button type="button" className="crop-modal-btn crop-modal-btn--cancel" onClick={handleCancel}>
                  Отмена
                </button>
                <button type="button" className="crop-modal-btn crop-modal-btn--save" onClick={handleSave}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      

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
