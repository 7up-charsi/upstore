import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SideBarContent } from './side-bar-content';
import { Branding } from '@/components/branding';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import React from 'react';

const displayName = 'MobileNavigation';

export const MobileNavigation = () => {
  return (
    <div className="flex h-16 items-center justify-between overflow-hidden px-5 [--branding-size:theme(fontSize.2xl)] lg:hidden">
      <Branding />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="[&_svg]:size-6"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent className="p-0">
          <SheetTitle className="sr-only">
            navigation sheet
          </SheetTitle>

          <SideBarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

MobileNavigation.displayName = displayName;
