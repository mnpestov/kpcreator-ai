import { jwtDecode } from 'jwt-decode';

export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token); // вернёт { id, email, name, role, ... }
  } catch (err) {
    console.error('Ошибка при декодировании токена', err);
    return null;
  }
};
