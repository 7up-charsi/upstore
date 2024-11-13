'use client';

import {
  FileObject,
  useFilesUpload,
} from '@/zustand/use-files-upload';
import { useFilesUploadDialog } from '@/zustand/use-files-upload-dialog';
import { Button } from '@/components/ui/button';
import { createId } from '@paralleldrive/cuid2';
import { PlusIcon } from 'lucide-react';
import React from 'react';

const displayName = 'FileUploadButton';

export const FileUploadButton = () => {
  const updateFiles = useFilesUpload((s) => s.updateFiles);

  const updateSentRequest = useFilesUpload(
    (s) => s.updateSentRequest,
  );

  const updateStatus = useFilesUpload((s) => s.updateStatus);

  const { updateMinimized, updateOpen } = useFilesUploadDialog();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;

    if (!files) return;

    const filesArr: FileObject[] = Array.from(files).map((file) => ({
      id: createId(),
      file,
      haveRequestSent: false,
      status:
        file.size <= 50 * 1024 * 1024 ? 'uploading' : 'sizeExceed',
    }));

    updateFiles(filesArr);
    updateOpen(true);
    updateMinimized(false);

    filesArr
      .filter(
        (ele) => !ele.haveRequestSent && ele.status === 'uploading',
      )
      .map(async (ele) => {
        updateSentRequest(ele.id);

        const formData = new FormData();

        formData.set('file', ele.file);
        formData.set('clientSideId', ele.id);

        const res = await fetch('/api/file-upload', {
          method: 'POST',
          body: formData,
        });

        const { success, newFile } = await res.json();

        updateStatus(
          ele.id,
          success && newFile ? 'uploaded' : 'failed',
        );
      });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        tabIndex={-1}
        onChange={handleFiles}
        className="sr-only"
      />

      <Button
        ref={buttonRef}
        onClick={() => {
          inputRef.current?.click();
        }}
        className="bg-brand text-brand-foreground [--use-toast:false] hover:bg-brand/90"
      >
        <PlusIcon />
        <span>Upload</span>
      </Button>
    </>
  );
};

FileUploadButton.displayName = displayName;
