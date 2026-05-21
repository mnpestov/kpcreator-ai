import React, { createContext, useEffect, useState } from 'react';
import { getUserFromToken, getToken, saveToken, removeToken } from '../utils/auth';
import { MainApi } from '../utils/MainApi';

export const AuthContext = createContext({
  user: null,
  isAuth: false,
  login: () => { },
  logout: () => { },
  setUser: () => { },
});

export const AuthProvider = ({ children }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const [user, setUser] = useState(getUserFromToken());
  const [isAuth, setIsAuth] = useState(!!getToken());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsAuth(false);
      return;
    }

    fetch(`${API_URL}/auth/check`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          saveToken(data.token);
          setIsAuth(true);

          // 🟢 теперь получаем user из БД, а не из токена
          MainApi.getUser()
            .then((res) => {
              setUser(res.user);
            })
            .catch(() => {
              removeToken();
              setUser(null);
              setIsAuth(false);
            });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        removeToken();
        setUser(null);
        setIsAuth(false);
      });
  }, []);


  const login = (token) => {
    localStorage.setItem('authToken', token);
    setUser(getUserFromToken());
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
