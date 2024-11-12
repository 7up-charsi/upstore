import { FileUploader } from './file-uploader';
import React from 'react';

const displayName = 'Header';

export const Header = () => {
  return (
    <div className="flex h-16 items-center">
      <span>search</span>

      <div className="grow"></div>

      <FileUploader />
    </div>
  );
};

Header.displayName = displayName;
