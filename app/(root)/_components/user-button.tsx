'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { ClerkLoading, useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const displayName = 'UserButton';

export const UserButton = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const descId = React.useId();

  return (
    <article
      aria-label="signin user"
      aria-describedby={descId}
      className="flex h-12 items-center overflow-hidden"
    >
      <ClerkLoading>
        <Skeleton className="h-full w-full" />
      </ClerkLoading>

      {isLoaded && isSignedIn && (
        <>
          <Avatar className="size-9" aria-hidden="true">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.firstName}</AvatarFallback>
          </Avatar>

          <div className="ml-4 flex grow flex-col items-start overflow-hidden text-sm">
            <span id={descId} className="truncate font-medium">
              {`${user.firstName} ${user.lastName}`}
            </span>
            <span>{user.emailAddresses[0].emailAddress}</span>
          </div>

          <Button
            asChild
            size="icon"
            variant="ghost"
            className="ml-2"
          >
            <Link href="/profile">
              <SettingsIcon />
            </Link>
          </Button>
        </>
      )}
    </article>
  );
};

UserButton.displayName = displayName;
