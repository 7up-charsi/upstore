import { create } from 'zustand';

type Action = {
  type?: 'rename' | 'share' | 'details' | 'delete';
  label?: string;
};

type Store = {
  openId: string | null;
  onOpenIdChange: (openId: string | null) => void;
  action: Action;
  setAction: (action: Action) => void;
};

export const useFileActionDialog = create<Store>((set) => ({
  action: {},
  setAction: (action) => set({ action }),
  openId: null,
  onOpenIdChange: (openId) => {
    set({ openId });
  },
}));
