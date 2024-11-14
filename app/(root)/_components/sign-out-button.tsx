import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import React from 'react';

interface SignOutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const displayName = 'SignOutButton';

export const SignOutButton = (props: SignOutButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { signOut, loaded } = useClerk();

  return (
    <Button
      {...props}
      variant="ghost"
      disabled={!loaded}
      className="mt-3 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive active:bg-destructive/25"
      onClick={async () => {
        setIsLoading(true);
        await signOut();
      }}
    >
      <span>Sign out</span>
      {isLoading && <Loader2Icon className="animate-spin" />}
    </Button>
  );
};

SignOutButton.displayName = displayName;
