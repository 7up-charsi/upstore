'use client';

import { useFilesUploadDialog } from '@/zustand/use-files-upload-dialog';
import { ChevronDownIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useFilesUpload } from '@/zustand/use-files-upload';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';
import React from 'react';

const displayName = 'FilesUploadDialog';

export const FilesUploadDialog = () => {
  const uploadDialogLabelId = React.useId();

  const { isMinimized, open, updateOpen, toggleMinimized } =
    useFilesUploadDialog();

  const { files, clearFiles } = useFilesUpload();

  const uploadedItemsCount = files.filter(
    (ele) => ele.status === 'uploaded',
  ).length;

  const uploadingItemsCount = files.filter(
    (ele) => ele.status === 'uploading',
  ).length;

  const content = (
    <div
      role="dialog"
      tabIndex={0}
      aria-labelledby={uploadDialogLabelId}
      className="fixed bottom-0 z-20 max-h-[70vh] w-full overflow-hidden rounded-t-md bg-background shadow max-md:left-0 md:right-16 md:w-80"
    >
      <div className="flex h-12 items-center bg-blue-100 px-5">
        <span id={uploadDialogLabelId} className="mr-2 grow">
          {files.every((ele) => ele.status !== 'uploading')
            ? `${uploadedItemsCount} upload${uploadedItemsCount > 1 ? 's' : ''} complete`
            : `Uploading ${uploadingItemsCount} item${uploadingItemsCount > 1 ? 's' : ''}`}
        </span>

        <Button
          size="icon"
          data-minimized={isMinimized}
          variant="ghost"
          aria-label={`${
            isMinimized ? 'expand' : 'minimize'
          } files upload dialog`}
          onClick={() => {
            toggleMinimized();
          }}
          className="data-[minimized=true]:rotate-180"
        >
          <ChevronDownIcon />
        </Button>

        <Button
          size="icon"
          aria-label="close upload dialog"
          onClick={() => {
            clearFiles();
            updateOpen(false);
          }}
          variant="ghost"
        >
          <XIcon />
        </Button>
      </div>

      <div
        data-minimized={isMinimized}
        className="h-auto overflow-hidden data-[minimized=true]:h-0"
      >
        <ul className="flex flex-col">
          {files.map((ele) => (
            <li
              key={ele.id}
              data-error={ele.status === 'sizeExceed'}
              className="flex h-12 items-center gap-2 px-3 data-[error=true]:bg-destructive/10"
            >
              <span className="grow truncate text-sm">
                {ele.file.name}
              </span>

              <span
                data-error={
                  ele.status === 'sizeExceed' ||
                  ele.status === 'failed'
                }
                data-success={ele.status === 'uploaded'}
                className="shrink-0 text-sm text-blue-600 data-[error=true]:text-destructive data-[success=true]:text-green-600"
              >
                {ele.status === 'failed' && 'Failed'}
                {ele.status === 'sizeExceed' && 'Size Exceeded'}
                {ele.status === 'uploaded' && 'Uploaded'}

                {ele.status === 'uploading' && (
                  <Loader2Icon size={20} className="animate-spin" />
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {open &&
        !!files.length &&
        createPortal(content, globalThis.document?.body)}
    </>
  );
};

FilesUploadDialog.displayName = displayName;
