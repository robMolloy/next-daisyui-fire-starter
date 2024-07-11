import { create } from "zustand";

type TAuthState = {
  isLoggedIn: undefined | boolean;
  setIsLoggedIn: (x: undefined | boolean) => void;
};
export const useAuthStore = create<TAuthState>()((set, _) => ({
  isLoggedIn: undefined,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
}));
