import { create } from 'zustand';

interface DrawerStateConfig {
  actions: {
    hideMenu: () => void;
    showMenu: () => void;
  };
  show: boolean;
}

const useMobileKeyboardCheck = create<DrawerStateConfig>()((set) => ({
  actions: {
    hideMenu: () => set({ show: false }),
    showMenu: () => set({ show: true }),
  },
  show: true,
}));

export const useMobileKeyboard = () =>
  useMobileKeyboardCheck((state) => ({
    show: state.show,
  }));

export const useMobileKeyboardActions = () => useMobileKeyboardCheck((state) => state.actions);
