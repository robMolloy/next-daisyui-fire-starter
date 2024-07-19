import { User } from "firebase/auth";
import { create } from "zustand";

type TAuthState = {
  user: undefined | null | User;
  setUser: (x: null | User) => void;
};
export const useAuthStoreBase = create<TAuthState>()((set, _) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user })),
}));

export const useAuthStore = () => {
  const authStoreBase = useAuthStoreBase();
  const user = authStoreBase.user;
  const isLoggedIn = !!authStoreBase.user ? true : authStoreBase.user;

  return {
    getSafeStore: () => {
      if (user === undefined) return { status: "loading" } as const;
      if (user === null) return { status: "logged_out" } as const;
      return { status: "logged_in", user } as const;
    },
    user,
    isLoggedIn,
  };
};
