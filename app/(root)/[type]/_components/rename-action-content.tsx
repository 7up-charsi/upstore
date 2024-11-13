'use client';

import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface RenameActionContentProps extends Models.Document, DbFile {}

const displayName = 'RenameActionContent';

export const RenameActionContent = (
  props: RenameActionContentProps,
) => {
  const { ..._file } = props;

  const descId = React.useId();
  const [value, setValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <form
      onSubmit={() => {
        setIsLoading(true);

        if (!value) {
          setErrorMessage('Input is required');
          setIsLoading(false);
          return;
        }
      }}
    >
      <div className="mt-10">
        <Input
          aria-describedby={descId}
          aria-invalid={!!errorMessage}
          aria-label="rename"
          placeholder="Enter New name here..."
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div
          id={descId}
          className="mt-1 h-5 text-sm text-destructive"
        >
          {errorMessage}
        </div>
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
