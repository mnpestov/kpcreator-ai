import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getUserFromToken, getToken, saveToken, removeToken } from '../utils/auth';
import { MainApi } from '../utils/MainApi';
import { API_BASE_URL } from '../utils/const';
import useAuthStore from '../hooks/useAuthStore';

export const AuthContext = createContext({
  user: null,
  isAuth: false,
  login: () => { },
  logout: () => { },
  setUser: () => { },
  tgNeedsBind: false,
  setTgNeedsBind: () => { },
  tgInitDataRaw: null,
  setTgInitDataRaw: () => { }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromToken());
  const [isAuth, setIsAuth] = useState(!!getToken());
  const [tgNeedsBind, setTgNeedsBind] = useState(false);
  const [tgInitDataRaw, setTgInitDataRaw] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsAuth(false);
      return;
    }

    fetch(`${API_BASE_URL}/auth/check`, {
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


  const login = useCallback((token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = getUserFromToken();
    setUser(decodedUser);
    setIsAuth(true);
    // Sync with Zustand store synchronously
    useAuthStore.setState({ user: decodedUser, isAuth: true });
    // Run async fetch to populate full user info
    useAuthStore.getState().initAuth();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuth(false);
    // Sync with Zustand store
    useAuthStore.setState({ user: null, isAuth: false });
  }, []);

  const value = useMemo(
    () => ({ user, isAuth, login, logout, setUser, tgNeedsBind, setTgNeedsBind, tgInitDataRaw, setTgInitDataRaw }),
    [user, isAuth, login, logout, tgNeedsBind, tgInitDataRaw, setUser, setTgNeedsBind, setTgInitDataRaw]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
