import { create } from 'zustand';

type UseFilesUploadDialog = {
  open: boolean;
  updateOpen: (open: boolean) => void;
  isMinimized: boolean;
  updateMinimized: (isMinimized: boolean) => void;
  toggleMinimized: () => void;
};

export const useFilesUploadDialog = create<UseFilesUploadDialog>(
  (set) => ({
    open: false,
    isMinimized: false,
    updateOpen: (open) => {
      set({ open });
    },
    updateMinimized: (isMinimized) => {
      set({ isMinimized });
    },
    toggleMinimized: () => {
      set((prev) => ({ isMinimized: !prev.isMinimized }));
    },
  }),
);
