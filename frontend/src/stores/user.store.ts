import { create } from "zustand";

import type { User } from "@/src/types/user";

interface UserState {
    user: User | null;

    setUser: (
        user: User
    ) => void;

    clearUser: () => void;

    updateUser: (
        user: Partial<User>
    ) => void;
}

export const useUserStore =
    create<UserState>((set) => ({
        user: null,

        setUser: (
            user
        ) =>
            set({
                user,
            }),

        clearUser: () =>
            set({
                user: null,
            }),

        updateUser: (
            updates
        ) =>
            set((state) => ({
                user: state.user
                    ? {
                        ...state.user,
                        ...updates,
                    }
                    : null,
            })),
    }));

export default useUserStore;