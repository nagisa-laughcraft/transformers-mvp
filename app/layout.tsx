import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Love Lens',
  description: 'An MVP web app that reflects your relationship style using transformers.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
