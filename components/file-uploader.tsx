'use client';

import {
  ChevronDownIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { fileUpload } from '@/actions/file.actions';
import { createId } from '@paralleldrive/cuid2';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import React from 'react';

interface FileObject {
  id: string;
  file: File;
  haveStarted: boolean;
  status:
    | 'uploaded'
    | 'uploading'
    | 'failed'
    | 'canceled'
    | 'sizeExceed';
}

const displayName = 'FileUploader';

export const FileUploader = () => {
  const uploadDialogLabelId = React.useId();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isMinimized, setIsMinimized] = React.useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] =
    React.useState(true);

  const [files, setFiles] = React.useState<FileObject[]>([]);

  const handleFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;

    if (!files) return;

    const filesArr: FileObject[] = Array.from(files).map((file) => ({
      id: createId(),
      file,
      haveStarted: false,
      status:
        file.size <= 50 * 1024 * 1024 ? 'uploading' : 'sizeExceed',
    }));

    setFiles((prev) => [...filesArr, ...prev]);
    setUploadDialogOpen(true);
    setIsMinimized(false);

    filesArr
      .filter((ele) => !ele.haveStarted && ele.status === 'uploading')
      .map(async (ele) => {
        setFiles((prev) =>
          prev.map((item) =>
            item.id === ele.id
              ? { ...item, haveStarted: true }
              : item,
          ),
        );

        const { success, newFile } = await fileUpload({
          file: ele.file,
        });

        setFiles((prev) =>
          prev.map((item) =>
            item.id === ele.id
              ? {
                  ...item,
                  status: success && newFile ? 'uploaded' : 'failed',
                }
              : item,
          ),
        );
      });
  };

  const uploadedItemsCount = files.filter(
    (ele) => ele.status === 'uploaded',
  ).length;

  const uploadingItemsCount = files.filter(
    (ele) => ele.status === 'uploading',
  ).length;

  const uploadDialog = (
    <div
      role="dialog"
      tabIndex={0}
      aria-labelledby={uploadDialogLabelId}
      className="fixed bottom-0 z-[9999] max-h-[70vh] w-full overflow-hidden rounded-t-md bg-background shadow max-md:left-0 md:right-16 md:w-80"
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
            setIsMinimized((prev) => !prev);
          }}
          className="data-[minimized=true]:rotate-180"
        >
          <ChevronDownIcon />
        </Button>

        <Button
          size="icon"
          aria-label="close upload dialog"
          onClick={() => {
            setFiles([]);
            setUploadDialogOpen(false);
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
      <div className="">
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFiles}
          className="hidden"
        />

        <Button
          ref={buttonRef}
          onClick={() => {
            inputRef.current?.click();
          }}
          className="bg-brand text-brand-foreground [--use-toast:false] hover:bg-brand/90 lg:[--use-toast:true]"
        >
          <PlusIcon />
          <span>Upload</span>
        </Button>
      </div>

      {uploadDialogOpen &&
        !!files.length &&
        createPortal(uploadDialog, globalThis.document?.body)}
    </>
  );
};

FileUploader.displayName = displayName;
