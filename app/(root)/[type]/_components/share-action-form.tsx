'use client';

import { Loader2Icon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

interface ShareActionFormProps {
  onShare: (value: string) => void;
}

const displayName = 'ShareActionForm';

export const ShareActionForm = (props: ShareActionFormProps) => {
  const { onShare } = props;

  const descId = React.useId();
  const [value, setValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  return (
    <form
      className="overflow-auto p-1"
      onSubmit={() => {
        setIsLoading(true);

        if (!value) {
          setErrorMessage('Email is required');
          setIsLoading(false);
          return;
        }

        onShare?.(value);
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
