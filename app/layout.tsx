import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import ToastProvider from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'SegreGate — Community Waste Segregation',
  description:
    'Community-driven waste segregation reporting system for households, volunteers, and authorities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-white dark:bg-gray-950"
      >
        <UIProvider>
          <ToastProvider />
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}
