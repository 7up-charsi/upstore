'use client';

import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { updateFileUsers } from '@/actions/files.actions';
import { Loader2Icon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface ShareActionContentProps extends Models.Document, DbFile {}

const displayName = 'ShareActionForm';

export const ShareActionForm = (props: ShareActionContentProps) => {
  const { ...file } = props;

  const descId = React.useId();

  const router = useRouter();

  const onOpenIdChange = useFileActionDialog((s) => s.onOpenIdChange);

  const [value, setValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <form
      className="overflow-auto p-1"
      onSubmit={async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        if (!value.trim()) {
          setErrorMessage('Email is required');
          setIsLoading(false);
          return;
        }

        try {
          const results = await updateFileUsers({
            id: file.$id,
            emails: value.trim().split(','),
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
      <div className="flex gap-2">
        <Input
          aria-describedby={descId}
          aria-invalid={!!errorMessage}
          aria-label="rename"
          placeholder="Enter email here..."
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button type="submit" size="icon" className="">
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Share2Icon />
          )}
        </Button>
      </div>

      <div id={descId} className="mt-1 flex flex-col px-1 text-sm">
        <span className="h-5 text-muted-foreground">
          Multiple emails must be separated by comma.
        </span>
        <span className="h-5 truncate text-destructive">
          {errorMessage}
        </span>
      </div>
    </form>
  );
};

ShareActionForm.displayName = displayName;
