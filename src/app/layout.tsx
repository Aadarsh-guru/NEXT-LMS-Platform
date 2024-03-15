import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru',
  description: 'Next LMS app is an LMS platfrom to sell and market courses and digital asests. built usingnext js 14.',
  keywords: ['nextjs', 'lms', 'courses', 'digital assets', 'marketplace', 'aadarsh guru', 'aadarsh', 'guru', 'aadarsh guru lms'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
};
