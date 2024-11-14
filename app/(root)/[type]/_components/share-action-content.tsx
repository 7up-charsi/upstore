import { ShareActionForm } from './share-action-form';
import { RemoveUser } from './remove-user';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';

interface ShareActionContentProps extends Models.Document, DbFile {}

const displayName = 'ShareActionContent';

export const ShareActionContent = (
  props: ShareActionContentProps,
) => {
  const { ...file } = props;

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
                {file.users.length} user
                {file.users.length > 1 ? 's' : ''}
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

                    <RemoveUser id={file.$id} email={user.email} />
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
