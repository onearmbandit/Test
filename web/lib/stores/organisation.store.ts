import { create } from "zustand";

type Store = {
  navItem: string;
  setNav: (value: string) => void;
  orgSection: string;
  setOrgSection: (value: string) => void;
};

export const useAccountStore = create<Store>()((set) => ({
  navItem: "organisation",
  setNav: (val: string) => set(() => ({ navItem: val })),

  orgSection: "home",
  setOrgSection: (val: string) => set(() => ({ orgSection: val })),
}));
