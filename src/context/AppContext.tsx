/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Movie } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { movieService } from '../services/movieService';

interface AppContextType {
  user: User | null;
  loadingUser: boolean;
  movies: Movie[];
  loadingMovies: boolean;
  currentPage: string;
  currentMovieId: string | null;
  searchQuery: string;
  selectedGenre: string;
  selectedCategory: 'Movie' | 'TV Show' | 'All';
  error: string | null;
  
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSelectedCategory: (category: 'Movie' | 'TV Show' | 'All') => void;
  setError: (error: string | null) => void;
  
  navigateTo: (page: string, movieId?: string | null) => void;
  login: (email: string, password_raw: string) => Promise<void>;
  register: (email: string, username: string, password_raw: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (movieId: string) => Promise<void>;
  recordWatchProgress: (movieId: string, progress: number) => Promise<void>;
  updateProfile: (firstName: string, lastName: string, plan: 'Basic' | 'Standard' | 'Premium') => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);
  
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentMovieId, setCurrentMovieId] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<{ page: string; movieId: string | null }[]>([]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'Movie' | 'TV Show' | 'All'>('All');
  
  const [error, setError] = useState<string | null>(null);

  // Initialize session and movies
  useEffect(() => {
    async function init() {
      try {
        setLoadingUser(true);
        const currentUser = await authService.getCurrentSessionUser();
        setUser(currentUser);
      } catch (err: any) {
        console.error('Failed to restore user session', err);
      } finally {
        setLoadingUser(false);
      }

      try {
        setLoadingMovies(true);
        const allMovies = await movieService.getMovies();
        setMovies(allMovies);
      } catch (err: any) {
        setError('Could not retrieve movies from the server. Please try again later.');
        console.error('Failed to load movies', err);
      } finally {
        setLoadingMovies(false);
      }
    }
    init();
  }, []);

  // Custom SPA Router Navigation
  const navigateTo = (page: string, movieId: string | null = null) => {
    // Save previous state to history stack for "go back" capabilities if needed
    setHistoryStack(prev => [...prev, { page: currentPage, movieId: currentMovieId }]);
    
    setCurrentPage(page);
    setCurrentMovieId(movieId);
    setError(null); // Clear errors on page transition
    
    // Automatically reset category filter depending on page tab
    if (page === 'movies') {
      setSelectedCategory('Movie');
    } else if (page === 'tv-shows') {
      setSelectedCategory('TV Show');
    } else if (page !== 'search') {
      // Keep category filter for search but clean up other page states
      setSelectedGenre('');
    }
    
    // Scroll to top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email: string, password_raw: string) => {
    try {
      setError(null);
      const res = await authService.loginUser(email, password_raw);
      setUser(res.user);
      navigateTo('home');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
      throw err;
    }
  };

  const register = async (email: string, username: string, password_raw: string) => {
    try {
      setError(null);
      const res = await authService.registerUser(email, username, password_raw);
      setUser(res.user);
      navigateTo('home');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logoutUser();
      setUser(null);
      navigateTo('home');
    } catch (err: any) {
      console.error('Logout error', err);
    }
  };

  const toggleFavorite = async (movieId: string) => {
    if (!user) {
      navigateTo('login');
      return;
    }
    
    try {
      const isFav = user.favoriteMovieIds.includes(movieId);
      let updatedUser: User;
      if (isFav) {
        updatedUser = await userService.removeFavorite(movieId);
      } else {
        updatedUser = await userService.addFavorite(movieId);
      }
      setUser(updatedUser);
    } catch (err: any) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const recordWatchProgress = async (movieId: string, progress: number) => {
    if (!user) return;
    try {
      const updatedUser = await userService.updateWatchHistory(movieId, progress);
      setUser(updatedUser);
    } catch (err: any) {
      console.error('Failed to update watch history', err);
    }
  };

  const updateProfile = async (firstName: string, lastName: string, plan: 'Basic' | 'Standard' | 'Premium') => {
    if (!user) return;
    try {
      setError(null);
      const updatedUser = await userService.updateProfileSettings({
        firstName,
        lastName,
        subscriptionPlan: plan
      });
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile settings.');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        movies,
        loadingMovies,
        currentPage,
        currentMovieId,
        searchQuery,
        selectedGenre,
        selectedCategory,
        error,
        setSearchQuery,
        setSelectedGenre,
        setSelectedCategory,
        setError,
        navigateTo,
        login,
        register,
        logout,
        toggleFavorite,
        recordWatchProgress,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
