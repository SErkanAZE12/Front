/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Base API Client Setup for Django REST Framework Integration
 * 
 * When connecting to your real Django backend, you can replace the mock delay and storage
 * with standard axios or fetch calls.
 * 
 * Example:
 * const api = axios.create({
 *   baseURL: API_BASE_URL,
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * 
 * api.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('access_token');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 */

// Supporting Vite-style VITE_API_URL or Next-style NEXT_PUBLIC_API_URL for flexibility
const metaEnv = (import.meta as any).env || {};
export const API_BASE_URL = 
  metaEnv.VITE_API_URL || 
  metaEnv.NEXT_PUBLIC_API_URL || 
  'http://localhost:8000/api'; // Django's default port is typically 8000

// Helper to simulate network latency for loading skeletons and real UX simulation
export const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Authentication storage utilities for Django JWT (e.g., djangorestframework-simplejwt)
 */
export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem('access_token'),
  getRefreshToken: (): string | null => localStorage.getItem('refresh_token'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
