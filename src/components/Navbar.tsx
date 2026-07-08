/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User as UserIcon, LogOut, Heart, Clock, Settings, Menu, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const { 
    user, 
    currentPage, 
    navigateTo, 
    searchQuery, 
    setSearchQuery, 
    logout 
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to style Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside profile menu clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state transitions when typing in search bar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== '' && currentPage !== 'search') {
      navigateTo('search');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled 
          ? 'bg-zinc-950/95 border-b border-zinc-900/60 shadow-lg py-3 backdrop-blur-md' 
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between">
        
        {/* Left Side: Brand Logo and Navigation links */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div 
            onClick={() => { clearSearch(); navigateTo('home'); }} 
            className="text-red-600 font-black text-2xl md:text-3xl tracking-tighter cursor-pointer flex items-center select-none active:scale-95 transition"
          >
            CINE<span className="text-zinc-100 font-light">STREAM</span>
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full ml-1 animate-pulse"></span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-300">
            <button
              onClick={() => { clearSearch(); navigateTo('home'); }}
              className={`hover:text-white transition cursor-pointer relative py-1 ${
                currentPage === 'home' ? 'text-white font-bold' : ''
              }`}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full animate-fade-in" />
              )}
            </button>
            <button
              onClick={() => { clearSearch(); navigateTo('movies'); }}
              className={`hover:text-white transition cursor-pointer relative py-1 ${
                currentPage === 'movies' ? 'text-white font-bold' : ''
              }`}
            >
              Movies
              {currentPage === 'movies' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full animate-fade-in" />
              )}
            </button>
            <button
              onClick={() => { clearSearch(); navigateTo('tv-shows'); }}
              className={`hover:text-white transition cursor-pointer relative py-1 ${
                currentPage === 'tv-shows' ? 'text-white font-bold' : ''
              }`}
            >
              TV Shows
              {currentPage === 'tv-shows' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full animate-fade-in" />
              )}
            </button>
            {user && (
              <button
                onClick={() => { clearSearch(); navigateTo('profile'); }}
                className={`hover:text-white transition cursor-pointer relative py-1 ${
                  currentPage === 'profile' ? 'text-white font-bold' : ''
                }`}
              >
                My List
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Search, Notifications, Profiles */}
        <div className="flex items-center space-x-4 md:space-x-6">
          
          {/* Smart Search Bar */}
          <div className="relative flex items-center bg-zinc-900/60 border border-zinc-800 rounded-full px-3 py-1.5 max-w-[150px] sm:max-w-[240px] transition-all">
            <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchExpanded(true)}
              placeholder="Search titles, actors..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 w-full"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="text-zinc-400 hover:text-white transition text-[10px]">
                ✕
              </button>
            )}
          </div>

          {/* Help Notice/Notifications (Aesthetic element) */}
          <div className="relative text-zinc-400 hover:text-white cursor-pointer transition hidden sm:block">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full border border-zinc-950"></span>
          </div>

          {/* Authentication Section */}
          {user ? (
            /* Logged In Dropdown */
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none select-none active:scale-95 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-zinc-800 object-cover hover:border-red-600 transition"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs text-zinc-300 font-medium hidden lg:block truncate max-w-[100px]">
                  {user.firstName || user.username}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-md bg-zinc-950 border border-zinc-800 shadow-2xl p-2.5 space-y-1.5 animate-fade-in text-sm text-zinc-200">
                  <div className="px-2 py-1.5 border-b border-zinc-900 text-xs">
                    <p className="text-zinc-400">Signed in as</p>
                    <p className="text-white font-semibold truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-red-600/10 border border-red-500/30 text-red-400 font-extrabold text-[8px] uppercase tracking-wider">
                      {user.subscriptionPlan} Plan
                    </span>
                  </div>

                  <button
                    onClick={() => { setIsProfileOpen(false); navigateTo('profile'); }}
                    className="w-full text-left px-2 py-2 hover:bg-zinc-900 rounded flex items-center space-x-2.5 transition"
                  >
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { setIsProfileOpen(false); navigateTo('profile'); }}
                    className="w-full text-left px-2 py-2 hover:bg-zinc-900 rounded flex items-center space-x-2.5 transition"
                  >
                    <Heart className="w-4 h-4 text-zinc-400" />
                    <span>Favorites</span>
                  </button>

                  <button
                    onClick={() => { setIsProfileOpen(false); logout(); }}
                    className="w-full text-left px-2 py-2 hover:bg-zinc-900 rounded flex items-center space-x-2.5 text-red-400 hover:text-red-300 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out - Sign In button */
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 active:scale-95 transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-zinc-400 hover:text-white transition focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Responsive Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950/98 border-b border-zinc-900 p-4 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <button
              onClick={() => { setIsMobileMenuOpen(false); clearSearch(); navigateTo('home'); }}
              className={`text-left py-2 hover:text-red-500 transition ${currentPage === 'home' ? 'text-red-500 font-bold' : 'text-zinc-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); clearSearch(); navigateTo('movies'); }}
              className={`text-left py-2 hover:text-red-500 transition ${currentPage === 'movies' ? 'text-red-500 font-bold' : 'text-zinc-300'}`}
            >
              Movies
            </button>
            <button
              onClick={() => { setIsMobileMenuOpen(false); clearSearch(); navigateTo('tv-shows'); }}
              className={`text-left py-2 hover:text-red-500 transition ${currentPage === 'tv-shows' ? 'text-red-500 font-bold' : 'text-zinc-300'}`}
            >
              TV Shows
            </button>
            {user && (
              <button
                onClick={() => { setIsMobileMenuOpen(false); clearSearch(); navigateTo('profile'); }}
                className={`text-left py-2 hover:text-red-500 transition ${currentPage === 'profile' ? 'text-red-500 font-bold' : 'text-zinc-300'}`}
              >
                My Profile & List
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
