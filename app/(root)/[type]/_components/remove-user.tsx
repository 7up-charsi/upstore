import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { removeFileSharedUser } from '@/actions/files.actions';
import { Loader2Icon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';

interface RemoveUserProps {
  email: string;
  id: string;
}

const displayName = 'RemoveUser';

export const RemoveUser = (props: RemoveUserProps) => {
  const { email, id } = props;

  const router = useRouter();

  const onOpenIdChange = useFileActionDialog((s) => s.onOpenIdChange);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemoveUser = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const results = await removeFileSharedUser({ id, email });

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
    <Button
      onClick={handleRemoveUser}
      aria-label="remove user from shared user list"
      size="icon"
      variant="ghost"
      disabled={isLoading}
      className=""
    >
      {isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <XIcon />
      )}
    </Button>
  );
};

RemoveUser.displayName = displayName;
