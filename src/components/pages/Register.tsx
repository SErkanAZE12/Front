/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const { register, navigateTo, error, setError } = useApp();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setError(null);

    // Frontend checks
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (username.trim().length < 3) {
      setFormError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters for security.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.');
      return;
    }
    if (!acceptTerms) {
      setFormError('You must accept the terms of service to register.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      /**
       * BACKEND INTEGRATION TIP:
       * When ready to connect to Django REST Framework:
       * 1. Send POST to `/api/register/` with email, username, and password
       * 2. Receive successful JWT tokens
       * 3. Set standard Auth headers for upcoming sessions
       */
      await register(email, username, password);
    } catch (err: any) {
      console.error('Registration failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex items-center justify-center py-20 px-4 font-sans">
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80"
          className="w-full h-full object-cover opacity-25 brightness-50"
          alt="Cinematic background"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950" />
      </div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-zinc-950/80 border border-zinc-900/80 p-8 md:p-10 shadow-2xl backdrop-blur-md animate-fade-in space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Create Account</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Ready to explore? Create an account today to get personalized recommendations and custom bookmark watch lists.
          </p>
        </div>

        {/* Form Alerts */}
        {(formError || error) && (
          <div className="p-3 rounded-md bg-red-950/20 border border-red-900/50 text-red-200 text-xs flex items-start space-x-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{formError || error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="reg-email">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="viewer@example.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cinestream_fan"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="reg-confirm">
                Confirm
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
                required
              />
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start space-x-2 pt-1 select-none">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded border-zinc-800 bg-zinc-900 text-red-600 focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="terms-checkbox" className="text-[11px] text-zinc-500 leading-normal">
              I agree to CineStream’s terms of use, cookie policies, and confirm I am of appropriate legal viewing age.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-red-600/10 active:scale-98 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Registering...' : 'Register Now'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Form Footer Switch */}
        <div className="pt-4 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <button
              onClick={() => { setError(null); navigateTo('login'); }}
              className="text-white hover:underline font-bold transition"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
export default Register;
