import { create } from 'zustand';
import { getToken, saveToken, removeToken } from '../utils/auth';
import { MainApi } from '../utils/MainApi';
import { API_BASE_URL } from '../utils/const';

const useAuthStore = create((set) => ({
    user: null,
    isAuth: false,

    initAuth: async () => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/auth/check`, {
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

    setUser: (updater) => set((state) => ({ user: typeof updater === 'function' ? updater(state.user) : updater })),
    logout: () => {
        removeToken();
        set({ user: null, isAuth: false });
    }
}));

export default useAuthStore;
