import {
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface DeleteActionContentProps extends Models.Document, DbFile {}

const displayName = 'DeleteActionContent';

export const DeleteActionContent = (
  props: DeleteActionContentProps,
) => {
  const { ...file } = props;

  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
  };

  return (
    <>
      <DialogDescription className="text-center">
        Are you sure you want to delete <br />
        <span className="font-medium">{file.name}</span>?
      </DialogDescription>

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          variant="destructive"
          onClick={handleDelete}
        >
          <span>Delete</span>

          {isLoading && <Loader2Icon className="animate-spin" />}
        </Button>
      </div>
    </>
  );
};

DeleteActionContent.displayName = displayName;
