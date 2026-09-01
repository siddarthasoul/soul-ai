import { create } from "zustand";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;

    setAuthenticated: (
        value: boolean
    ) => void;

    setLoading: (
        value: boolean
    ) => void;

    reset: () => void;
}

export const useAuthStore =
    create<AuthState>((set) => ({
        isAuthenticated: false,
        isLoading: false,

        setAuthenticated: (
            value
        ) =>
            set({
                isAuthenticated: value,
            }),

        setLoading: (
            value
        ) =>
            set({
                isLoading: value,
            }),

        reset: () =>
            set({
                isAuthenticated: false,
                isLoading: false,
            }),
    }));

export default useAuthStore;