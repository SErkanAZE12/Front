/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Settings, ShieldCheck, Heart, Clock, Check, Edit, Save, Loader2, Sparkles } from 'lucide-react';
import { MovieCard } from '../MovieCard';

export const Profile = () => {
  const { user, movies, updateProfile, navigateTo } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Standard' | 'Premium'>('Standard');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state on user load
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setSelectedPlan(user.subscriptionPlan);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-zinc-950 min-h-screen text-white pt-32 px-4 flex flex-col justify-center items-center">
        <div className="max-w-md text-center space-y-4">
          <User className="w-16 h-16 text-zinc-700 mx-auto" />
          <h3 className="text-xl font-bold">Sign In Required</h3>
          <p className="text-xs text-zinc-500">
            Please sign in to access your dashboard, settings, and bookmarked favorites.
          </p>
          <button
            onClick={() => navigateTo('login')}
            className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      /**
       * BACKEND INTEGRATION TIP:
       * When ready to connect to Django REST Framework:
       * - Submit a PATCH request to your profile details endpoint (e.g., `PATCH /api/users/me/`)
       * - Send fields: { first_name: firstName, last_name: lastName, subscription_plan: selectedPlan }
       */
      await updateProfile(firstName, lastName, selectedPlan);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter movies matching favorite IDs
  const favoriteMovies = movies.filter(m => user.favoriteMovieIds.includes(m.id));

  // Build watch history list with corresponding movie metadata and progress
  const historyList = user.watchHistory.map(item => {
    const movieMeta = movies.find(m => m.id === item.movieId);
    return {
      ...item,
      movie: movieMeta
    };
  }).filter(item => item.movie !== undefined);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* Left Hand Sidebar: User Avatar, Subscription Plan and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-900 flex flex-col items-center text-center space-y-4">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-24 h-24 rounded-full border-2 border-red-600 object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center justify-center space-x-1">
                <span>{user.firstName ? `${user.firstName} ${user.lastName}` : user.username}</span>
              </h3>
              <p className="text-xs text-zinc-500 font-mono">@{user.username}</p>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
            
            <span className="px-2.5 py-1 rounded bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
              {user.subscriptionPlan} Plan
            </span>
            
            <p className="text-[10px] text-zinc-500">Member since {user.joinedDate}</p>
          </div>

          {/* Quick Subscription Switch Component */}
          <div className="p-6 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
              <h4 className="text-zinc-200 font-bold text-xs uppercase tracking-wider">Plan Subscriptions</h4>
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Manage your monthly streaming allowances. Click to select a tier:
            </p>

            <div className="space-y-2">
              {[
                { name: 'Basic', resolution: '480p SD', screens: '1 Screen' },
                { name: 'Standard', resolution: '1080p FHD', screens: '2 Screens' },
                { name: 'Premium', resolution: '4K UltraHD + HDR', screens: '4 Screens' }
              ].map((tier) => (
                <div
                  key={tier.name}
                  onClick={() => setSelectedPlan(tier.name as any)}
                  className={`p-3 rounded border text-xs cursor-pointer flex items-center justify-between transition-all select-none ${
                    selectedPlan === tier.name
                      ? 'bg-red-600/10 border-red-500 text-white font-semibold'
                      : 'bg-zinc-950 border-zinc-900/80 text-zinc-400 hover:border-zinc-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-zinc-200">{tier.name}</p>
                    <p className="text-[10px] text-zinc-500">{tier.resolution} • {tier.screens}</p>
                  </div>
                  {selectedPlan === tier.name && <Check className="w-4 h-4 text-red-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand Side: Account Settings Inputs & Lists matrices */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Account Settings Form */}
          <div className="p-6 rounded-lg bg-zinc-900/20 border border-zinc-900 space-y-6">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <Settings className="w-4 h-4 text-red-600" />
              <h4 className="text-zinc-100 font-bold text-sm">Account Preferences</h4>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="prof-first">
                    First Name
                  </label>
                  <input
                    id="prof-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alexander"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-red-600 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="prof-last">
                    Last Name
                  </label>
                  <input
                    id="prof-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mercer"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-red-600 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1 animate-fade-in">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Preferences updated successfully!</span>
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500 italic">Changes will sync to local database state.</span>
                )}
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 shrink-0" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bookmarked Favorites Row Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <h4 className="text-zinc-100 font-bold text-sm">My List / Favorites ({favoriteMovies.length})</h4>
              </div>
            </div>

            {favoriteMovies.length === 0 ? (
              <div className="p-10 rounded-lg border border-dashed border-zinc-900 text-center space-y-3">
                <p className="text-xs text-zinc-500">Your bookmark collection is currently empty.</p>
                <button
                  onClick={() => navigateTo('home')}
                  className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  Discover Trending Titles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>

          {/* Watch History Progress Bars List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-600" />
                <h4 className="text-zinc-100 font-bold text-sm">Resume Watching / History</h4>
              </div>
            </div>

            {historyList.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No movie viewing history recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {historyList.map((item, index) => {
                  const m = item.movie!;
                  return (
                    <div
                      key={index}
                      onClick={() => navigateTo('movie-details', m.id)}
                      className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 flex items-center justify-between gap-4 cursor-pointer transition active:scale-99"
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-16 aspect-[16/9] object-cover rounded shrink-0 border border-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-zinc-100 truncate">{m.title}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                            <span>{m.duration}</span>
                            <span>•</span>
                            <span>Watched {new Date(item.watchedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Progress Indicator bar with play action trigger */}
                      <div className="shrink-0 w-24 sm:w-32 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500">
                          <span>{item.progress}% Progress</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-600 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
