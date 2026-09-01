import { create } from "zustand";

interface AppState {
    isSidebarOpen: boolean;
    isMobileMenuOpen: boolean;

    setSidebarOpen: (
        open: boolean
    ) => void;

    toggleSidebar: () => void;

    setMobileMenuOpen: (
        open: boolean
    ) => void;

    toggleMobileMenu: () => void;
}

export const useAppStore = create<AppState>(
    (set) => ({
        isSidebarOpen: true,
        isMobileMenuOpen: false,

        setSidebarOpen: (
            open
        ) =>
            set({
                isSidebarOpen: open,
            }),

        toggleSidebar: () =>
            set((state) => ({
                isSidebarOpen:
                    !state.isSidebarOpen,
            })),

        setMobileMenuOpen: (
            open
        ) =>
            set({
                isMobileMenuOpen: open,
            }),

        toggleMobileMenu: () =>
            set((state) => ({
                isMobileMenuOpen:
                    !state.isMobileMenuOpen,
            })),
    })
);

export default useAppStore;