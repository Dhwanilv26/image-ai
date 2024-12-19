import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Toaster } from '@/components/ui/sonner';

import { Providers } from '@/components/providers';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { Modals } from '@/components/modals';

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
  title: 'Image AI',
  description: 'Your personalised canva clone',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <Toaster />
            <Modals/>
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
