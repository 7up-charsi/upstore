import { Branding } from '@/components/branding';
import { createId } from '@paralleldrive/cuid2';
import { siteConfig } from '@/site.config';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;

  const id = createId();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-10 py-16">
      <Branding />

      <p
        id={id}
        className="mt-5 text-balance text-center text-2xl font-semibold"
      >
        {siteConfig.description}
      </p>

      <p className="mb-10 mt-2 text-balance text-center text-muted-foreground">
        This is a place where you can store all documents.
      </p>

      {children}
    </main>
  );
}
