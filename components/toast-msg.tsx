import { ToastContentProps } from 'react-toastify';
import React from 'react';

const displayName = 'ToastMsg';

export const ToastMsg = (
  props: ToastContentProps<{
    type: 'error' | 'success';
    name: string;
    isBigEnough?: boolean;
  }>,
) => {
  const { data } = props;

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-full bg-white"></div>

        <div className="text-sm">
          <p className="font-semibold">
            {data.type === 'error' ? 'Failed' : 'Uploaded'}
          </p>
          <p className="truncate">{data.name}</p>
        </div>
      </div>

      {data.isBigEnough && (
        <>
          <hr className="my-2" />
          <p className="truncate text-sm">Max size is 50MB</p>
        </>
      )}
    </>
  );
};

ToastMsg.displayName = displayName;
