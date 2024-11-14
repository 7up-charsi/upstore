'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';
import React from 'react';

const displayName = 'SignOutButton';

export const SignOutButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { onClick, disabled } = props;

  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      variant="ghost"
      disabled={disabled}
      className="mt-3 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive active:bg-destructive/25"
      onClick={(event) => {
        setIsLoading(true);
        onClick?.(event);
      }}
    >
      <span>Sign out</span>
      {isLoading && <Loader2Icon className="animate-spin" />}
    </Button>
  );
};

SignOutButton.displayName = displayName;
