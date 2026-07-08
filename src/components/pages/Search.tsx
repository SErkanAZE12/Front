/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MovieCard } from '../MovieCard';
import { MOCK_GENRES } from '../../data/mockData';
import { Search as SearchIcon, SlidersHorizontal, EyeOff, Sparkles, FilterX } from 'lucide-react';
import { movieService } from '../../services/movieService';
import { Movie } from '../../types';

export const Search = () => {
  const { 
    movies,
    searchQuery, 
    setSearchQuery, 
    selectedGenre, 
    setSelectedGenre, 
    selectedCategory, 
    setSelectedCategory 
  } = useApp();

  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  // Filter movies lists in real-time
  useEffect(() => {
    async function filter() {
      setSearching(true);
      try {
        const results = await movieService.searchMovies(
          searchQuery,
          selectedGenre,
          selectedCategory
        );
        setSearchResults(results);
      } catch (err) {
        console.error('Filtering failed', err);
      } finally {
        setSearching(false);
      }
    }
    filter();
  }, [searchQuery, selectedGenre, selectedCategory, movies]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedCategory('All');
  };

  const trendingMovies = movies.filter(m => m.isTrending);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-8">
        
        {/* Search Feed Title & Quick Filters Controls Panel */}
        <div className="space-y-4 md:flex md:items-center md:justify-between md:space-y-0 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100 flex items-center space-x-2">
              <SearchIcon className="w-5 h-5 text-red-600 shrink-0" />
              <span>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Catalog'}
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Refined by categories and cinematic themes.
            </p>
          </div>

          {/* Quick Clear Reset Button */}
          {(searchQuery || selectedGenre || selectedCategory !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-600 font-bold text-xs transition flex items-center space-x-1.5 active:scale-95 cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 1. Category Tabs and Genre Carousel */}
        <div className="space-y-4">
          
          {/* Main Category Switches */}
          <div className="flex items-center space-x-2.5 text-xs sm:text-sm">
            <span className="text-zinc-500 font-bold mr-2 uppercase tracking-wider text-[10px] hidden sm:block">Category:</span>
            {(['All', 'Movie', 'TV Show'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md border text-xs font-bold transition select-none cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/10'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100'
                }`}
              >
                {cat === 'All' ? 'All Formats' : cat === 'Movie' ? 'Movies Only' : 'TV Shows Only'}
              </button>
            ))}
          </div>

          {/* Scrolling Genre Capsules Carousel */}
          <div className="flex items-center space-x-2 border-t border-zinc-900/60 pt-4">
            <span className="text-zinc-500 font-bold mr-2 uppercase tracking-wider text-[10px] shrink-0 hidden sm:block">Themes:</span>
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-2 select-none w-full" style={{ scrollbarWidth: 'none' }}>
              
              {/* "All Genres" Capsule */}
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                  selectedGenre === ''
                    ? 'bg-zinc-100 border-white text-black font-extrabold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                All Genres
              </button>

              {/* Genre Iterations */}
              {MOCK_GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                    selectedGenre === g.name
                      ? 'bg-red-600/10 border-red-500 text-red-400 font-extrabold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 2. Results Bento Grid */}
        {searching ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : searchResults.length === 0 ? (
          /* High Quality Fallback Empty State Box */
          <div className="space-y-12">
            <div className="p-12 rounded-lg bg-zinc-900/15 border border-zinc-900 flex flex-col justify-center items-center text-center space-y-4">
              <EyeOff className="w-12 h-12 text-zinc-700 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold text-lg text-zinc-200">No Titles Found</p>
                <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                  We couldn't locate any movies or shows matching your combination of keywords, category tabs, or genre filters. Try relaxing your filters or search keywords.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-xs font-bold transition text-zinc-300 cursor-pointer"
              >
                Clear All Search Filters
              </button>
            </div>

            {/* Recommendations Row below empty state */}
            {trendingMovies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-400 text-sm font-bold border-b border-zinc-900 pb-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Trending Fallback Picks For You</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {trendingMovies.slice(0, 5).map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid of Results */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
