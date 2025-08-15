'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

function LinkAccountsContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorType, setErrorType] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'OAuthAccountNotLinked') {
      setErrorType('oauth');
    } else if (error) {
      setErrorType('general');
    }
  }, [searchParams]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage(
          'Invalid credentials. Please check your email and password.'
        );
      } else {
        setMessage(
          'Success! You can now use Google sign-in with this account.'
        );
        // Redirect to dashboard after successful sign-in
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-xl">
              {errorType === 'oauth'
                ? 'Account Linking Required'
                : 'Authentication Error'}
            </CardTitle>
            <CardDescription>
              {errorType === 'oauth'
                ? "You're trying to sign in with Google, but an account with this email already exists using email/password."
                : 'There was an issue with your authentication. Please try signing in with your credentials.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Solution:
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Sign in with your existing email/password first, then you'll be
                able to use Google sign-in.
              </p>
            </div>

            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.includes('Success')
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in with Email/Password'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => signIn('google')}
                >
                  Sign up with Google
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LinkAccountsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LinkAccountsContent />
    </Suspense>
  );
}
