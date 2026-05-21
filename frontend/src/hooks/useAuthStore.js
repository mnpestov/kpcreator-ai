import { create } from 'zustand';
import { getToken, saveToken, removeToken } from '../utils/auth';
import { MainApi } from '../utils/MainApi';

const useAuthStore = create((set) => ({
    user: null,
    isAuth: false,

    initAuth: async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/auth/check`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.token) {
                saveToken(data.token);
                const userRes = await MainApi.getUser();
                set({ user: userRes.user, isAuth: true });
            }
        } catch (e) {
            removeToken();
            set({ user: null, isAuth: false });
        }
    },

    setUser: (user) => set({ user }),
    logout: () => {
        removeToken();
        set({ user: null, isAuth: false });
    }
}));

export default useAuthStore;
