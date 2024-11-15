import { FilesUploadDialog } from './_components/files-upload-dialog';
import { MobileNavigation } from './_components/mobile-navigation';
import { SideBarContent } from './_components/side-bar-content';
import { Header } from './_components/header';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;

  return (
    <>
      <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-[auto_1fr]">
        <aside className="sticky top-0 h-screen w-72 max-lg:hidden">
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
