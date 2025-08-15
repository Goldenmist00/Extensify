'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Button onClick={() => router.push('/login')}>Login</Button>;
  }

  return (
    <div className="flex items-center gap-4">
      {session.user?.image && (
        <img
          src={session.user.image}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <span>{session.user?.name || session.user?.email}</span>
      <Button variant="outline" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
