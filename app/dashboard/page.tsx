'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import ChromeExtensionBuilder from '../page';
import { Button } from '@/components/ui/button';
import {
  Code,
  Sun,
  Moon,
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ClientProvider from '@/components/ClientProvider';

export default function DashboardPage() {
  return (
    <ClientProvider>
      <DashboardContent />
    </ClientProvider>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center p-4 transition-all duration-700 relative overflow-hidden">
        <iframe
          src="https://my.spline.design/robotfollowcursorforlandingpage-GHwuWvReUDe98j7MPQaUoJXs/"
          className="fixed inset-0 w-full h-full -z-10 border-0"
        />
        {/* Enhanced Background decoration for dark mode */}
        {/* ... (copy your login page JSX here, or import a LoginPage component) ... */}
        <div className="relative w-full max-w-md z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4 relative">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl dark:shadow-purple-500/25 relative overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Extensify Logo"
                  className="w-12 h-12"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="absolute top-0 right-0 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-700/50 dark:text-gray-300 dark:hover:text-white transition-all duration-300 rounded-full"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow-sm">
              Extensify
            </h1>
            <p className="text-gray-600 dark:text-slate-300">
              {isSignUp
                ? 'Create your account to start building'
                : 'Welcome back! Sign in to continue'}
            </p>
          </div>

          {/* Login/Signup Card */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-8">
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (isSignUp) {
                  // Handle signup
                  try {
                    const res = await fetch('/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email, password }),
                    });
                    if (res.ok) {
                      // After successful registration, sign in
                      const result = await signIn('credentials', {
                        email,
                        password,
                        callbackUrl: '/dashboard',
                        redirect: false,
                      });

                      if (result?.error) {
                        alert(
                          `Auto-login failed: ${result.error}. Please try signing in manually.`
                        );
                      }
                    } else {
                      const error = await res.json();
                      alert(error.error || 'Registration failed');
                    }
                  } catch (error) {
                    alert('Registration failed');
                  }
                } else {
                  // Handle login
                  const result = await signIn('credentials', {
                    email,
                    password,
                    callbackUrl: '/dashboard',
                    redirect: false,
                  });

                  if (result?.error) {
                    alert(`Login failed: ${result.error}`);
                  }
                }
              }}
              className="space-y-4"
            >
              {/* Social Login Buttons */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    signIn('google', { callbackUrl: '/dashboard' })
                  }
                  className="w-full bg-gradient-to-r from-white to-gray-50 dark:from-slate-700/80 dark:to-slate-600/80 border-0 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all duration-200 dark:text-slate-200 dark:hover:text-white relative overflow-hidden group"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  <span>Continue with Google</span>
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full dark:bg-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 px-2 text-gray-500 dark:text-slate-400">
                    Or continue with email
                  </span>
                </div>
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="pl-10 bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-700/50 dark:to-slate-600/50 border-0 shadow-sm focus:shadow-md dark:focus:shadow-lg dark:focus:shadow-indigo-500/20 transition-all duration-200 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/30"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-slate-300">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-700/50 dark:to-slate-600/50 border-0 shadow-sm focus:shadow-md dark:focus:shadow-lg dark:focus:shadow-indigo-500/20 transition-all duration-200 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/30"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-slate-300">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-700/50 dark:to-slate-600/50 border-0 shadow-sm focus:shadow-md dark:focus:shadow-lg dark:focus:shadow-indigo-500/20 transition-all duration-200 dark:text-slate-200 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/30"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 dark:hover:from-indigo-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-indigo-500/25 dark:hover:shadow-indigo-500/40 transition-all duration-200 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </form>
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {isSignUp
                  ? 'Already have an account?'
                  : "Don't have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ChromeExtensionBuilder />;
}
