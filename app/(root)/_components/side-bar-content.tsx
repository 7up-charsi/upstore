'use client';

import {
  ChartPieIcon,
  FilesIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  VideoIcon,
} from 'lucide-react';
import { FileUploadButton } from './file-upload-button';
import { SignOutButton } from './sign-out-button';
import { Branding } from '@/components/branding';
import { usePathname } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import { UserButton } from './user-button';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboardIcon size={20} />,
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: <FilesIcon size={20} />,
  },
  {
    title: 'Images',
    href: '/images',
    icon: <ImagesIcon size={20} />,
  },
  {
    title: 'Media',
    href: '/media',
    icon: <VideoIcon size={20} />,
  },
  {
    title: 'Others',
    href: '/others',
    icon: <ChartPieIcon size={20} />,
  },
];

const displayName = 'SideBarContent';

export const SideBarContent = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col p-5 [--branding-size:theme(fontSize.2xl)]">
      <Branding />

      <div className="mt-5 grow space-y-2">
        {links.map((ele, i) => (
          <Link
            key={i}
            href={ele.href}
            data-active={ele.href === pathname}
            className="group flex h-11 items-center gap-2 rounded px-3 transition-colors before:hidden before:h-3/5 before:w-1 before:rounded-full before:bg-primary hover:bg-primary/10 data-[active=true]:before:block"
          >
            <span className="opacity-70 group-data-[active=true]:opacity-100">
              {ele.icon}
            </span>
            <span>{ele.title}</span>
          </Link>
        ))}
      </div>

      <div className="my-5 lg:hidden [&>button]:w-full">
        <FileUploadButton />
        <p className="mt-2 px-1 text-center text-sm text-muted-foreground">
          You can monitor the file upload progress by closing this
          navigation sheet in the upload dialog.
        </p>
      </div>

      <UserButton />

      <React.Suspense>
        <ClerkProvider dynamic>
          <SignOutButton />
        </ClerkProvider>
      </React.Suspense>
    </div>
  );
};

SideBarContent.displayName = displayName;
