'use client';

import { Loader2Icon } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { Button } from './ui/button';
import React from 'react';

const displayName = 'SignOutButton';

export const SignOutButton = () => {
  const { signOut, isLoaded } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      variant="ghost"
      disabled={!isLoaded}
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
