'use client';

import {
  ChartPieIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  VideoIcon,
} from 'lucide-react';
import { SignOutButton } from './sign-out-button';
import { usePathname } from 'next/navigation';
import { UserButton } from './user-button';
import { Branding } from './branding';
import Link from 'next/link';

const links = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboardIcon size={20} />,
  },
  {
    title: 'Images',
    href: '',
    icon: <ImagesIcon size={20} />,
  },
  {
    title: 'Media',
    href: '',
    icon: <VideoIcon size={20} />,
  },
  {
    title: 'Others',
    href: '',
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
            className="hover:bg-brand/10 data-[active=true]:bg-brand/70 data-[active=true]:text-brand-foreground data-[active=true]:hover:bg-brand/80 group flex h-11 items-center gap-2 rounded px-3 transition-colors"
          >
            <span className="opacity-70 group-data-[active=true]:opacity-100">
              {ele.icon}
            </span>
            <span>{ele.title}</span>
          </Link>
        ))}
      </div>

      <UserButton />
      <SignOutButton />
    </div>
  );
};

SideBarContent.displayName = displayName;
