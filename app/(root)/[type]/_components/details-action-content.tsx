import { convertFileSize, formatDateTime } from '@/lib/utils';
import { Models } from 'node-appwrite';
import { DbFile } from '@/types';

interface DetailsActionContentProps extends Models.Document, DbFile {}

const displayName = 'DetailsActionContent';

export const DetailsActionContent = (
  props: DetailsActionContentProps,
) => {
  const { ...file } = props;

  return (
    <>
      <dl className="space-y-4 px-2">
        <div className="flex gap-1 text-sm">
          <dt className="">Format:</dt>
          <dd className="font-semibold">{file.extension}</dd>
        </div>

        <div className="flex gap-1 text-sm">
          <dt className="">Size:</dt>
          <dd className="font-semibold">
            {convertFileSize(file.size)}
          </dd>
        </div>

        <div className="flex gap-1 text-sm">
          <dt className="">By: </dt>
          <dd className="font-semibold">
            {`${file.user.first_name} ${file.user.last_name}`}
          </dd>
        </div>

        <div className="flex gap-1 text-sm">
          <dt className="">Last edit:</dt>
          <dd className="font-semibold">
            {formatDateTime(file.$updatedAt)}
          </dd>
        </div>
      </dl>
    </>
  );
};

DetailsActionContent.displayName = displayName;
