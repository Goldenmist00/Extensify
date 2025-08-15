'use client';

import { SessionProvider } from 'next-auth/react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return <SessionProvider>{children}</SessionProvider>;
}
