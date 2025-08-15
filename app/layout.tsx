import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Extensify',
  description: 'Build powerful Chrome extensions without writing code',
  generator: 'Extensify',
  manifest: '/site.webmanifest',
  themeColor: '#0f172a',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: '16x16' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/logo.png' }],
    shortcut: [{ url: '/logo.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        {/* Explicit favicon links to ensure visibility across browsers */}
        <link rel="icon" href="/logo.png?v=1" type="image/png" />
        <link rel="shortcut icon" href="/logo.png?v=1" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=1" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
