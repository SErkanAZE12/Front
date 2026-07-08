/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthResponse, User } from '../types';
import { MOCK_USER } from '../data/mockData';
import { delay, tokenStorage } from './api';

/**
 * Authentication API Service
 * Prepared for Django REST Framework SimpleJWT endpoints:
 * - POST /api/token/          -> loginUser()
 * - POST /api/token/refresh/  -> refreshes access token
 * - POST /api/register/       -> registerUser()
 */
export const authService = {
  /**
   * Performs user login
   */
  async loginUser(email: string, password_raw: string): Promise<AuthResponse> {
    await delay(1000); // Realistic authentication delay

    // Validation mock
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (password_raw.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    // Simulate incorrect credentials test
    if (password_raw === 'wrong') {
      throw new Error('No active account found with the given credentials.');
    }

    // In production:
    // const response = await fetch(`${API_BASE_URL}/token/`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username: email, password: password_raw }) // Django often uses username/password
    // });
    // if (!response.ok) {
    //   const data = await response.json();
    //   throw new Error(data.detail || 'Authentication failed');
    // }
    // const data = await response.json();
    // tokenStorage.setTokens(data.access, data.refresh);
    // return data;

    // Simulate successful login
    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token_signature';
    const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token_signature';
    
    // Custom user based on email input or MOCK_USER fallback
    const user: User = {
      ...MOCK_USER,
      email: email,
      username: email.split('@')[0],
    };

    tokenStorage.setTokens(mockAccessToken, mockRefreshToken);
    localStorage.setItem('cached_user', JSON.stringify(user));

    return {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user
    };
  },

  /**
   * Performs user registration
   */
  async registerUser(email: string, username_raw: string, password_raw: string): Promise<AuthResponse> {
    await delay(1200);

    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (username_raw.trim().length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (password_raw.length < 6) {
      throw new Error('Password must be at least 6 characters for security.');
    }

    // In production:
    // const response = await fetch(`${API_BASE_URL}/register/`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, username: username_raw, password: password_raw })
    // });
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(Object.values(errorData).flat().join(' ') || 'Registration failed');
    // }
    // return response.json();

    const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_token_signature';
    const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_token_signature';

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      email,
      username: username_raw,
      firstName: '',
      lastName: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'July 2026',
      favoriteMovieIds: [],
      watchHistory: [],
      subscriptionPlan: 'Standard'
    };

    tokenStorage.setTokens(mockAccessToken, mockRefreshToken);
    localStorage.setItem('cached_user', JSON.stringify(newUser));

    return {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: newUser
    };
  },

  /**
   * Loads current session from local storage or cookies
   */
  async getCurrentSessionUser(): Promise<User | null> {
    // Check if access token exists
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    await delay(200); // Quick check
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/users/me/`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // if (!response.ok) {
    //   tokenStorage.clearTokens();
    //   return null;
    // }
    // return response.json();

    const cached = localStorage.getItem('cached_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return MOCK_USER;
      }
    }
    return MOCK_USER;
  },

  /**
   * Logs out the user
   */
  async logoutUser(): Promise<void> {
    await delay(300);
    tokenStorage.clearTokens();
    localStorage.removeItem('cached_user');
  }
};
