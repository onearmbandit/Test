import { create } from "zustand";

type Store = {
  user: { firstName: string; lastName: string };
  setUser: (val: any) => void;
};

export const useAuthStore = create<Store>()((set) => ({
  user: { firstName: "", lastName: "" },
  setUser: (val: any) => set(() => ({ user: val })),
}));
