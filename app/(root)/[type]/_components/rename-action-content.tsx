'use client';

import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { renameFile } from '@/actions/files.actions';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface RenameActionContentProps extends Models.Document, DbFile {}

const displayName = 'RenameActionContent';

export const RenameActionContent = (
  props: RenameActionContentProps,
) => {
  const { ...file } = props;

  const router = useRouter();

  const onOpenIdChange = useFileActionDialog((s) => s.onOpenIdChange);

  const descId = React.useId();
  const [value, setValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        if (!value.trim()) {
          setErrorMessage('Input is required');
          setIsLoading(false);
          return;
        }

        setErrorMessage('');

        try {
          const results = await renameFile({
            id: file.$id,
            name: value,
          });

          if (!results.success) throw results;

          onOpenIdChange(null);
          router.refresh();
        } catch (error) {
          if (
            error &&
            typeof error === 'object' &&
            'success' in error &&
            'message' in error &&
            typeof error.message === 'string'
          ) {
            setErrorMessage(error.message);
            return;
          }

          toast.error(
            'Something went wrong on server. Please try again',
          );
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <Input
        aria-describedby={descId}
        aria-invalid={!!errorMessage}
        aria-label="rename"
        placeholder="Enter New name here..."
        type="text"
        disabled={isLoading}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div id={descId} className="mt-1 h-5 text-sm text-destructive">
        {errorMessage}
      </div>

      <div className="mt-1 flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>

        <Button type="submit">
          <span>Submit</span>

          {isLoading && <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </form>
  );
};

RenameActionContent.displayName = displayName;
