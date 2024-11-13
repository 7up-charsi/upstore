import { convertFileSize, formatDateTime } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { Models } from 'node-appwrite';
import { Actions } from './actions';
import { DbFile } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CardProps extends Models.Document, DbFile {}

const displayName = 'Card';

export const Card = async (props: CardProps) => {
  const { ...file } = props;

  const user = await currentUser();

  return (
    <Link
      href={file.url}
      target="_blank"
      className="flex cursor-pointer flex-col gap-6 overflow-hidden rounded-lg bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex justify-between">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted">
          {file.type === 'image' ? (
            <Image
              src={file.url}
              alt={file.name}
              width={100}
              height={100}
              className="block size-full object-cover object-center"
            />
          ) : (
            <span className="size-11">file</span>
          )}
        </div>

        <div className="flex flex-col items-end justify-between">
          <Actions {...file} />

          <span>{convertFileSize(file.size)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="truncate text-sm font-semibold">
          {file.name}
        </span>

        <span className="truncate text-sm text-muted-foreground">
          {formatDateTime(file.$createdAt)}
        </span>

        <span className="truncate text-xs text-muted-foreground">
          By: {`${user?.firstName} ${user?.lastName}`}
        </span>
      </div>
    </Link>
  );
};

Card.displayName = displayName;
