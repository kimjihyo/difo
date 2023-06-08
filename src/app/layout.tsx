import type { Metadata } from 'next';
import { ReactNode } from 'react';
import localFont from 'next/font/local';

import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const globalFont = localFont({
  src: '../assets/fonts/Pretendard.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={globalFont.variable}>
      <body>{children}</body>
    </html>
  );
}
