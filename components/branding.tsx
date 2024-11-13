import { siteConfig } from '@/site.config';
import { ArchiveIcon } from 'lucide-react';
import React from 'react';

const displayName = 'Branding';

export const Branding = () => {
  return (
    <div className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 text-[length:var(--branding-size,theme(fontSize.3xl))] text-brand">
      <ArchiveIcon width="1em" height="1em" />

      <h1 className="font-medium">{siteConfig.name}</h1>
    </div>
  );
};

Branding.displayName = displayName;
