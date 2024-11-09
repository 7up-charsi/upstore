import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { siteConfig } from '@/site.config';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [
    {
      media: '(prefers-color-scheme: dark)',
      url: '/favicon-light.svg',
    },
    {
      media: '(prefers-color-scheme: light)',
      url: '/favicon-dark.svg',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="mx-auto max-w-screen-2xl">{children}</div>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </body>
    </html>
  );
}
