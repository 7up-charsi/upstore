import { create } from 'zustand';

type Store = {
  id: string | false;
  onIdChange: (id: string | false) => void;
};

const createStore = () =>
  create<Store>((set) => ({
    id: false,
    onIdChange: (id) => {
      set({ id });
    },
  }));

export const useFileRenameAction = createStore();
export const useFileShareAction = createStore();
export const useFileDeleteAction = createStore();
