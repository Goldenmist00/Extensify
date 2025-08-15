'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Chrome } from 'lucide-react';

export default function AuthForm() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Registration failed');
    } else {
      setSuccess('Registration successful! You can now log in.');
      setTab('login');
      setForm({ name: '', email: '', password: '' });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess('Login successful! Redirecting...');
      window.location.reload();
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    setSuccess('');
    try {
      await signIn('google', { redirect: false });
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Google Sign In Button */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        variant="outline"
        className="w-full py-3 text-base font-medium border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
      >
        {googleLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </div>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-gray-400">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 font-medium rounded-md transition-all duration-300 ${
            tab === 'login' 
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => {
            setTab('login');
            setError('');
            setSuccess('');
          }}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-2 px-4 font-medium rounded-md transition-all duration-300 ${
            tab === 'register' 
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          onClick={() => {
            setTab('register');
            setError('');
            setSuccess('');
          }}
        >
          Sign Up
        </button>
      </div>
      {/* Forms */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="py-3 text-base border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="py-3 text-base border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="py-3 text-base border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || googleLoading} 
            className="w-full py-3 text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      )}
      
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="py-3 text-base border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="py-3 text-base border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-300"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading || googleLoading} 
            className="w-full py-3 text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      )}
      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-green-700 dark:text-green-400 text-sm font-medium">{success}</div>
        </div>
      )}

      {/* Terms and Privacy */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
