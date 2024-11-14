import { ShareActionForm } from './share-action-form';
import { Button } from '@/components/ui/button';
import { Models } from 'node-appwrite';
import { XIcon } from 'lucide-react';
import { DbFile } from '@/types';
import React from 'react';

interface ShareActionContentProps extends Models.Document, DbFile {}

const displayName = 'ShareActionContent';

export const ShareActionContent = (
  props: ShareActionContentProps,
) => {
  const { ...file } = props;

  const handleRemoveUser = async (email: string) => {};

  return (
    <>
      <ShareActionForm {...file} />

      {file.users.length ? null : (
        <div className="text-center text-sm font-semibold text-muted-foreground">
          Shared with NO users
        </div>
      )}

      {!file.users.length ? null : (
        <div className="space-y-2">
          <div className="pt-4">
            <div className="flex justify-between">
              <span className="text-light-100 text-sm font-semibold">
                Shared with
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                {file.users.length} users
              </span>
            </div>

            <ul className="pt-2">
              {file.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-2"
                >
                  <>
                    <span className="text-sm font-semibold">
                      {user.email}
                    </span>

                    <Button
                      onClick={() => {
                        handleRemoveUser(user.email);
                      }}
                      aria-label="remove"
                      size="icon"
                      variant="ghost"
                      className=""
                    >
                      <XIcon />
                    </Button>
                  </>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

ShareActionContent.displayName = displayName;
