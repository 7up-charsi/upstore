import { create } from 'zustand';

export interface FileObject {
  id: string;
  file: File;
  haveRequestSent: boolean;
  status:
    | 'uploaded'
    | 'uploading'
    | 'failed'
    | 'canceled'
    | 'sizeExceed';
}

type UseFilesUpload = {
  files: FileObject[];
  clearFiles: () => void;
  updateFiles: (files: FileObject[]) => void;
  updateSentRequest: (id: string, sent?: boolean) => void;
  updateStatus: (id: string, status: FileObject['status']) => void;
};

export const useFilesUpload = create<UseFilesUpload>((set) => ({
  files: [],
  clearFiles: () => {
    set({ files: [] });
  },
  updateFiles: (files) => {
    set((prev) => ({
      files: [...files, ...prev.files],
    }));
  },
  updateSentRequest: (id, sent = true) => {
    set((prev) => ({
      files: prev.files.map((item) =>
        item.id === id ? { ...item, haveRequestSent: sent } : item,
      ),
    }));
  },
  updateStatus: (id, status) => {
    set((prev) => ({
      files: prev.files.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    }));
  },
}));
