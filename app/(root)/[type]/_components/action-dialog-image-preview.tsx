import { formatDateTime } from '@/lib/utils';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import Image from 'next/image';
import React from 'react';

interface ActionDialogImagePreviewProps
  extends Models.Document,
    DbFile {}

const displayName = 'ActionDialogImagePreview';

export const ActionDialogImagePreview = (
  props: ActionDialogImagePreviewProps,
) => {
  const { ...file } = props;

  return (
    <div className="mb-1 flex items-center gap-3 rounded-lg bg-muted p-3">
      <Image
        src={file.url}
        alt={file.name}
        width={100}
        height={100}
        className="size-8 object-contain"
      />

      <div className="flex flex-col overflow-auto">
        <span className="truncate text-sm font-semibold">
          {file.name}
        </span>

        <span className="truncate text-sm text-muted-foreground">
          {formatDateTime(file.$createdAt)}
        </span>
      </div>
    </div>
  );
};

ActionDialogImagePreview.displayName = displayName;
