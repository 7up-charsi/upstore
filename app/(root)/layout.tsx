import { FilesUploadDialog } from '@/components/files-upload-dialog';
import { MobileNavigation } from '@/components/mobile-navigation';
import { SideBarContent } from '@/components/side-bar-content';
import { Header } from '@/components/header';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <>
      <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-[auto_1fr]">
        <aside className="sticky top-0 h-full w-72 max-lg:hidden">
          <SideBarContent />
        </aside>

        <div className="flex flex-col lg:pb-5 lg:pr-5">
          <MobileNavigation />

          <Header />

          <div className="grow rounded-xl bg-muted">{children}</div>
        </div>
      </div>

      <FilesUploadDialog />
    </>
  );
}
