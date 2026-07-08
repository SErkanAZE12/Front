/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie } from '../types';
import { MOCK_MOVIES } from '../data/mockData';
import { delay } from './api';

/**
 * Movie API Service
 * Prepared for Django REST Framework endpoints:
 * - GET    /api/movies/          -> getMovies()
 * - GET    /api/movies/{id}/     -> getMovieDetails(id)
 * - GET    /api/movies/search/?q={query} -> searchMovies(query)
 */
export const movieService = {
  /**
   * Fetches all movies and TV shows
   */
  async getMovies(): Promise<Movie[]> {
    await delay(700); // Simulate network latency
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/movies/`);
    // if (!response.ok) throw new Error('Failed to fetch movies');
    // return response.json();
    
    return [...MOCK_MOVIES];
  },

  /**
   * Fetches detailed information for a specific movie or show
   */
  async getMovieDetails(id: string): Promise<Movie> {
    await delay(600);
    
    // In production:
    // const response = await fetch(`${API_BASE_URL}/movies/${id}/`);
    // if (!response.ok) throw new Error('Movie not found');
    // return response.json();
    
    const movie = MOCK_MOVIES.find(m => m.id === id);
    if (!movie) {
      throw new Error(`Movie with ID ${id} was not found on this server.`);
    }
    return { ...movie };
  },

  /**
   * Performs client or server search for movies matching the query or filters
   */
  async searchMovies(query: string, genreFilter?: string, categoryFilter?: 'Movie' | 'TV Show' | 'All'): Promise<Movie[]> {
    await delay(800);
    
    // In production:
    // const params = new URLSearchParams({ q: query });
    // if (genreFilter) params.append('genre', genreFilter);
    // if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);
    // const response = await fetch(`${API_BASE_URL}/movies/search/?${params.toString()}`);
    // return response.json();

    const normalizedQuery = query.toLowerCase().trim();
    
    return MOCK_MOVIES.filter(movie => {
      // 1. Query filter
      const matchesQuery = !normalizedQuery || 
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.description.toLowerCase().includes(normalizedQuery) ||
        movie.cast.some(actor => actor.toLowerCase().includes(normalizedQuery)) ||
        movie.director.toLowerCase().includes(normalizedQuery);
        
      // 2. Genre filter
      const matchesGenre = !genreFilter || movie.genres.includes(genreFilter);
      
      // 3. Category filter
      const matchesCategory = !categoryFilter || categoryFilter === 'All' || movie.category === categoryFilter;
      
      return matchesQuery && matchesGenre && matchesCategory;
    });
  },

  /**
   * Fetches trending items
   */
  async getTrending(): Promise<Movie[]> {
    await delay(500);
    return MOCK_MOVIES.filter(m => m.isTrending);
  },

  /**
   * Fetches popular items
   */
  async getPopular(): Promise<Movie[]> {
    await delay(500);
    return MOCK_MOVIES.filter(m => m.isPopular);
  },

  /**
   * Fetches top-rated items
   */
  async getTopRated(): Promise<Movie[]> {
    await delay(500);
    return MOCK_MOVIES.filter(m => m.isTopRated);
  }
};
