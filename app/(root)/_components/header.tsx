import { FileUploadButton } from './file-upload-button';
import React from 'react';

const displayName = 'Header';

export const Header = () => {
  return (
    <div className="flex h-16 items-center max-lg:hidden">
      <span>search</span>

      <div className="grow"></div>

      <FileUploadButton />
    </div>
  );
};

Header.displayName = displayName;
