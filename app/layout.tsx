import type {Metadata} from 'next';
import {AuthGate} from '@/components/auth-gate';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'My Google AI Studio App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
