'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { DetailsActionContent } from './details-action-content';
import { RenameActionContent } from './rename-action-content';
import { DeleteActionContent } from './delete-action-content';
import { ShareActionContent } from './share-action-content';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface ActionDialogProps extends Models.Document, DbFile {}

const displayName = 'ActionDialog';

export const ActionDialog = (props: ActionDialogProps) => {
  const { ...file } = props;

  const { onOpenIdChange, openId, action } = useFileActionDialog();

  return (
    <Dialog
      open={openId === file.$id}
      onOpenChange={(open) => {
        if (!open) onOpenIdChange(null);
      }}
    >
      <DialogContent
        role={action.type === 'delete' ? 'alertdialog' : 'dialog'}
        className="w-[90%] max-w-sm px-6 py-8"
      >
        {action.type === 'delete' ? null : (
          <DialogTitle className="text-center">
            {action.label}
          </DialogTitle>
        )}

        {action.type === 'rename' && (
          <RenameActionContent {...file} />
        )}

        {action.type === 'details' && (
          <DetailsActionContent {...file} />
        )}

        {action.type === 'share' && <ShareActionContent {...file} />}

        {action.type === 'delete' && (
          <DeleteActionContent {...file} />
        )}
      </DialogContent>
    </Dialog>
  );
};

ActionDialog.displayName = displayName;
