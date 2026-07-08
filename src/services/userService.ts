/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, WatchHistoryItem } from '../types';
import { MOCK_USER } from '../data/mockData';
import { delay } from './api';

/**
 * User Profile API Service
 * Prepared for Django REST Framework endpoints:
 * - GET    /api/users/me/             -> getUserProfile()
 * - PATCH  /api/users/me/             -> updateProfileSettings()
 * - POST   /api/movies/{id}/favorite/ -> addFavorite() / removeFavorite()
 */
export const userService = {
  /**
   * Fetches the current user's profile and stats
   */
  async getUserProfile(): Promise<User> {
    await delay(500);
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/users/me/`);
    // return response.json();

    const cached = localStorage.getItem('cached_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback
      }
    }
    
    // Seed standard mock user if nothing in localStorage
    localStorage.setItem('cached_user', JSON.stringify(MOCK_USER));
    return { ...MOCK_USER };
  },

  /**
   * Adds a movie to the user's favorites list
   */
  async addFavorite(movieId: string): Promise<User> {
    await delay(300);
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/movies/${movieId}/favorite/`, {
    //   method: 'POST'
    // });
    // return response.json();

    const user = await this.getUserProfile();
    if (!user.favoriteMovieIds.includes(movieId)) {
      user.favoriteMovieIds = [...user.favoriteMovieIds, movieId];
      localStorage.setItem('cached_user', JSON.stringify(user));
    }
    return user;
  },

  /**
   * Removes a movie from the user's favorites list
   */
  async removeFavorite(movieId: string): Promise<User> {
    await delay(300);
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/movies/${movieId}/favorite/`, {
    //   method: 'DELETE'
    // });
    // return response.json();

    const user = await this.getUserProfile();
    user.favoriteMovieIds = user.favoriteMovieIds.filter(id => id !== movieId);
    localStorage.setItem('cached_user', JSON.stringify(user));
    return user;
  },

  /**
   * Adds or updates a movie in the watch history
   */
  async updateWatchHistory(movieId: string, progress: number): Promise<User> {
    await delay(200);

    const user = await this.getUserProfile();
    const existingIndex = user.watchHistory.findIndex(item => item.movieId === movieId);
    const nowStr = new Date().toISOString();

    const updatedItem: WatchHistoryItem = {
      movieId,
      watchedAt: nowStr,
      progress: Math.min(100, Math.max(0, progress))
    };

    if (existingIndex > -1) {
      // Update existing item
      user.watchHistory[existingIndex] = updatedItem;
    } else {
      // Push new item to head of queue
      user.watchHistory = [updatedItem, ...user.watchHistory];
    }

    localStorage.setItem('cached_user', JSON.stringify(user));
    return user;
  },

  /**
   * Updates basic account settings (First Name, Last Name, Plan)
   */
  async updateProfileSettings(data: { firstName: string; lastName: string; subscriptionPlan?: 'Basic' | 'Standard' | 'Premium' }): Promise<User> {
    await delay(600);

    const user = await this.getUserProfile();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    if (data.subscriptionPlan) {
      user.subscriptionPlan = data.subscriptionPlan;
    }

    localStorage.setItem('cached_user', JSON.stringify(user));
    return user;
  }
};
