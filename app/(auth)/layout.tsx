import { createId } from '@paralleldrive/cuid2';
import { siteConfig } from '@/site.config';
import { ArchiveIcon } from 'lucide-react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;

  const id = createId();

  return (
    <main className="flex h-screen flex-col items-center justify-center px-10 py-16">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-pink-600 dark:text-pink-400">
        <ArchiveIcon size={40} />

        <h1 aria-describedby={id} className="text-3xl font-bold">
          {siteConfig.name}
        </h1>
      </div>

      <p
        id={id}
        className="mt-5 text-balance text-center text-2xl font-semibold"
      >
        {siteConfig.description}
      </p>

      <p className="mb-14 mt-2 text-balance text-center text-muted-foreground">
        This is a place where you can store all documents.
      </p>

      {children}
    </main>
  );
}
