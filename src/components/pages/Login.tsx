/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, ArrowRight, ShieldAlert, Key } from 'lucide-react';

export const Login = () => {
  const { login, navigateTo, error, setError } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setError(null);

    // Frontend validations
    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      /**
       * BACKEND INTEGRATION TIP:
       * When ready to connect to Django REST Framework:
       * 1. Submit POST to your Django SimpleJWT endpoint (e.g. `/api/token/`)
       * 2. Store returned 'access' and 'refresh' tokens in localStorage
       * 3. Set standard Auth header for subsequent requests
       */
      await login(email, password);
    } catch (err: any) {
      // Errors are caught and set in AppContext
      console.error('Login failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestLogin = () => {
    setEmail('developer@example.com');
    setPassword('password');
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center py-20 px-4 font-sans">
      
      {/* Background Poster Cover Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80"
          className="w-full h-full object-cover opacity-25 brightness-50"
          alt="Cinematic background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-zinc-950/80 border border-zinc-900/80 p-8 md:p-10 shadow-2xl backdrop-blur-md animate-fade-in space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Sign In</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Welcome back! Sign in to access your watch list, favorites, and custom viewing history.
          </p>
        </div>

        {/* Dynamic Alerts */}
        {(formError || error) && (
          <div className="p-3 rounded-md bg-red-950/20 border border-red-900/50 text-red-200 text-xs flex items-start space-x-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{formError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="password-input">
                Password
              </label>
              <span className="text-[10px] text-zinc-500 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-600/10 active:scale-98 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Credentials Sandbox (High usability indicator) */}
        <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <Key className="w-3.5 h-3.5 text-red-500" />
            <span>Developer Sandbox Accounts</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-normal">
            To bypass authentication during testing, click below to pre-fill standard credentials.
          </p>
          <button
            type="button"
            onClick={handleTestLogin}
            className="w-full py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-300 transition active:scale-95"
          >
            Pre-fill Admin Credentials
          </button>
        </div>

        {/* Navigation Switch */}
        <div className="pt-4 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-500">
            New to CineStream?{' '}
            <button
              onClick={() => { setError(null); navigateTo('register'); }}
              className="text-white hover:underline font-bold transition"
            >
              Sign up now
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
export default Login;
