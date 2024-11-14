'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DownloadIcon,
  EllipsisVerticalIcon,
  InfoIcon,
  Share2Icon,
  TextCursorIcon,
  TrashIcon,
} from 'lucide-react';
import { useFileActionDialog } from '@/zustand/use-file-action-dialog';
import { constructDownloadUrl } from '@/lib/utils';
import { ActionDialog } from './action-dialog';
import { useUser } from '@clerk/nextjs';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';
import Link from 'next/link';
import React from 'react';

interface ActionsProps extends Models.Document, DbFile {}

const displayName = 'Actions';

const dropdownItems = [
  {
    label: 'Rename',
    icon: <TextCursorIcon size={15} className="text-foreground/60" />,
    value: 'rename',
  },
  {
    label: 'Details',
    icon: <InfoIcon size={15} className="text-foreground/60" />,
    value: 'details',
  },
  {
    label: 'Share',
    icon: <Share2Icon size={15} className="text-foreground/60" />,
    value: 'share',
  },
  {
    label: 'Download',
    icon: <DownloadIcon size={15} className="text-foreground/60" />,
    value: 'download',
  },
  {
    label: 'Delete',
    icon: <TrashIcon size={15} className="text-destructive" />,
    value: 'delete',
  },
];

export const Actions = (props: ActionsProps) => {
  const { ...file } = props;

  const onOpenIdChange = useFileActionDialog((s) => s.onOpenIdChange);
  const setAction = useFileActionDialog((s) => s.setAction);

  const { user } = useUser();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-full text-foreground/30 outline-none ring-offset-transparent hover:bg-muted focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 data-[state=open]:bg-muted">
          <EllipsisVerticalIcon size={25} />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {dropdownItems.map((item) => (
            <DropdownMenuItem
              asChild={item.value === 'download'}
              key={item.value}
              data-delete={item.value === 'delete'}
              data-not-owner={
                (item.value === 'rename' ||
                  item.value === 'share' ||
                  item.value === 'delete') &&
                file.userId !== user?.id
              }
              className="cursor-pointer data-[not-owner=true]:cursor-default data-[delete=true]:text-destructive data-[not-owner=true]:opacity-50 data-[delete=true]:focus:bg-destructive/10 data-[delete=true]:focus:text-destructive"
              onSelect={(event) => {
                if (
                  (item.value === 'rename' ||
                    item.value === 'share' ||
                    item.value === 'delete') &&
                  file.userId !== user?.id
                ) {
                  event.preventDefault();
                  return;
                }

                if (item.value === 'download') return;

                onOpenIdChange(file.$id);

                if (item.value === 'rename') {
                  setAction({ label: 'Rename File', type: 'rename' });
                }

                if (item.value === 'details') {
                  setAction({
                    label: 'File Details',
                    type: 'details',
                  });
                }

                if (item.value === 'share') {
                  setAction({ label: 'Share File', type: 'share' });
                }

                if (item.value === 'delete') {
                  setAction({ label: 'Delete File', type: 'delete' });
                }
              }}
            >
              {item.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionDialog {...file} />
    </>
  );
};

Actions.displayName = displayName;
