/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Genre {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  movieId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WatchHistoryItem {
  movieId: string;
  watchedAt: string;
  progress: number; // Percentage 0 - 100
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  joinedDate: string;
  favoriteMovieIds: string[];
  watchHistory: WatchHistoryItem[];
  subscriptionPlan: 'Basic' | 'Standard' | 'Premium';
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl?: string; // Cinematic trailer/video url
  rating: number; // e.g., 4.8 or 8.9 (usually 10-based or 5-based)
  year: number;
  duration: string; // e.g. "2h 15m" or "8 Episodes"
  genres: string[];
  category: 'Movie' | 'TV Show';
  cast: string[];
  director: string;
  isTrending: boolean;
  isPopular: boolean;
  isTopRated: boolean;
  maturityRating: string; // e.g. "PG-13", "R", "TV-MA"
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
