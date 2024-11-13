import { FileUploadButton } from './file-upload-button';
import React from 'react';

const displayName = 'Header';

export const Header = () => {
  return (
    <div className="sticky top-0 flex h-16 items-center bg-background/70 backdrop-blur-sm max-lg:hidden">
      <span>search</span>

      <div className="grow"></div>

      <FileUploadButton />
    </div>
  );
};

Header.displayName = displayName;
