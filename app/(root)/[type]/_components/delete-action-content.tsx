import {
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { deleteFile } from '@/actions/files.actions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import React from 'react';

interface DeleteActionContentProps extends Models.Document, DbFile {}

const displayName = 'DeleteActionContent';

export const DeleteActionContent = (
  props: DeleteActionContentProps,
) => {
  const { ...file } = props;

  const router = useRouter();

  const onOpenIdChange = useFileActionDialog((s) => s.onOpenIdChange);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const results = await deleteFile({
        id: file.$id,
        bucketFileId: file.bucketFileId,
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
        toast.error(error.message);
        return;
      }

      toast.error('Something went wrong on server. Please try again');
    } finally {
      setIsLoading(false);
    }
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
