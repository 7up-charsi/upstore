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
import { useFileRenameAction } from '@/zustand/file-actions';
import { constructDownloadUrl } from '@/lib/utils';
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
    icon: <TrashIcon size={15} className="text-foreground/60" />,
    value: 'delete',
  },
];

export const Actions = (props: ActionsProps) => {
  const { ...file } = props;

  const onRenameIdChange = useFileRenameAction((s) => s.onIdChange);

  //   TODO: add alert dialog for delete action
  //   {action.value === 'delete' && (
  //     <p className="text-center text-muted-foreground">
  //       Are you sure you want to delete{' '}
  //       <span className="font-medium">{file.name}</span>?
  //     </p>
  //   )}

  return (
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
            className="cursor-pointer"
            onClick={() => {
              if (item.value === 'rename') onRenameIdChange(file.$id);
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
  );
};

Actions.displayName = displayName;
