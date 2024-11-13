import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

interface RenameActionContentProps {
  onSubmit: (value: string) => void;
}

const displayName = 'RenameActionContent';

export const RenameActionContent = (
  props: RenameActionContentProps,
) => {
  const { onSubmit } = props;

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

        onSubmit?.(value);
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

        <div id={descId} className="h-5 text-sm text-destructive">
          {errorMessage}
        </div>
      </div>

      <DialogFooter className="mt-1">
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>

        <Button type="submit">
          <span>Submit</span>

          {isLoading && <Loader2Icon className="ml-2 animate-spin" />}
        </Button>
      </DialogFooter>
    </form>
  );
};

RenameActionContent.displayName = displayName;
