'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
  User,
  Code,
  Zap,
  Download,
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        // Auto-login after registration
        await signIn('credentials', { email, password, redirect: false });
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Registration failed');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const result = await signIn(provider, {
        callbackUrl: '/dashboard',
        redirect: true,
      });
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in error:', error);
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-indigo-950/40 dark:to-purple-950/40 flex items-center justify-center p-4 transition-all duration-700 relative overflow-hidden">
      {/* Enhanced Background decoration for dark mode */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Light mode orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 dark:from-indigo-500/30 dark:to-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 dark:from-cyan-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Dark mode exclusive elements */}
        <div className="dark:block hidden">
          {/* Starfield effect */}
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-32 w-1 h-1 bg-indigo-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-20 right-40 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-200"></div>
          <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-800"></div>

          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/50 via-transparent to-slate-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/20 via-transparent to-purple-900/20"></div>

          {/* Animated gradient lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4 relative">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl dark:shadow-purple-500/25 relative overflow-hidden">
              <img src="/logo.png" alt="Extensify Logo" className="w-12 h-12" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="absolute top-0 right-0 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 dark:text-gray-300 dark:hover:text-white transition-all duration-300 rounded-full"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Extensify
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            {isSignUp
              ? 'Create your account to start building'
              : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Login/Signup Card */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-xl border-0 shadow-2xl dark:shadow-3xl dark:shadow-black/50 relative overflow-hidden">
          {/* Card glow effect for dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-lg"></div>
          <div className="absolute inset-0 border border-gradient-to-br from-indigo-200/20 via-purple-200/20 to-pink-200/20 dark:from-indigo-400/20 dark:via-purple-400/20 dark:to-pink-400/20 rounded-lg"></div>

          <CardHeader className="space-y-1 pb-4 relative z-10">
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center dark:text-slate-400">
              {isSignUp
                ? 'Join thousands of makers building amazing extensions'
                : 'Enter your credentials to access your workspace'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {/* Social Login Buttons */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-gradient-to-r from-white to-gray-50 dark:from-slate-700/80 dark:to-slate-600/80 border-0 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all duration-200 dark:text-slate-200 dark:hover:text-white relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-indigo-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Chrome className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Continue with Google</span>
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

            {/* Email/Password Form */}
            <form
              onSubmit={isSignUp ? handleSignUp : handleLogin}
              className="space-y-4"
            >
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

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-slate-700"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm dark:text-slate-300"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="px-0 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 dark:hover:from-indigo-500 dark:hover:via-purple-500 dark:hover:to-pink-500 text-white shadow-lg hover:shadow-xl dark:shadow-2xl dark:shadow-indigo-500/25 dark:hover:shadow-indigo-500/40 transition-all duration-200 relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">
                  {loading
                    ? isSignUp
                      ? 'Creating Account...'
                      : 'Signing In...'
                    : isSignUp
                      ? 'Create Account'
                      : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              {error && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
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
          </CardContent>
        </Card>

        {/* Enhanced Features Preview */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-1 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              </div>
              <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Visual Builder
              </span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-1 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-3 h-3 text-purple-500 dark:text-purple-400" />
              </div>
              <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                No Code Required
              </span>
            </div>
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-1 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 group-hover:scale-110 transition-transform duration-200">
                <Download className="w-3 h-3 text-pink-500 dark:text-pink-400" />
              </div>
              <span className="group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200">
                Instant Export
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
