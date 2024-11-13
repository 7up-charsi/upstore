'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { RenameActionContent } from './rename-action-content';
import { useFileRenameAction } from '@/zustand/file-actions';
import React from 'react';

const displayName = 'RenameActionDialog';

export const RenameActionDialog = () => {
  const { onIdChange, id } = useFileRenameAction();

  return (
    <Dialog
      open={!!id}
      onOpenChange={(open) => {
        if (!open) onIdChange(false);
      }}
    >
      <DialogContent className="w-[90%] max-w-sm px-6 py-8">
        <DialogTitle className="text-center">Rename File</DialogTitle>

        <RenameActionContent
          onSubmit={async (value) => {
            console.log({ value });

            // renameFile({
            //   fileId: file.$id,
            //   name,
            // });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

RenameActionDialog.displayName = displayName;
