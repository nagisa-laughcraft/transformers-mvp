import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Love Lens',
  description: '恋愛タイプ診断のMVPアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
