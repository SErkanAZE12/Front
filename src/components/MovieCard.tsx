/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  key?: string | number;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { user, toggleFavorite, navigateTo } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = user?.favoriteMovieIds.includes(movie.id) || false;
  
  // Find watch history progress
  const watchProgress = user?.watchHistory.find(item => item.movieId === movie.id)?.progress || 0;

  // Calculate dynamic match percentage based on rating for Netflix realism
  const matchPercentage = Math.floor(movie.rating * 10 + 9);

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] relative rounded-md overflow-hidden bg-zinc-900 border border-zinc-800/30 transition-all duration-300 ease-out transform cursor-pointer select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigateTo('movie-details', movie.id)}
    >
      {/* Aspect Ratio Box 16:9 for backdrops, or standard movie aspects */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-955 via-transparent to-black/20" />
        
        {/* Watch Progress Red Line */}
        {watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
            <div 
              className="h-full bg-red-600 transition-all duration-500" 
              style={{ width: `${watchProgress}%` }}
            />
          </div>
        )}

        {/* Rating Star Badge (Top-Right) */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-yellow-500 flex items-center space-x-1 text-[10px] sm:text-xs font-bold border border-zinc-800/40 backdrop-blur-sm">
          <Star className="w-3 h-3 fill-yellow-500 shrink-0" />
          <span>{movie.rating}</span>
        </div>
      </div>

      {/* Basic Under-Card details for small screens or default state */}
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-zinc-100 font-semibold text-xs sm:text-sm truncate w-3/4">
            {movie.title}
          </h4>
          <span className="text-[10px] text-zinc-400 shrink-0">
            {movie.year}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-zinc-400">
          <span className="text-emerald-500 font-bold">{matchPercentage}% Match</span>
          <span className="px-1 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-[9px] font-bold">
            {movie.maturityRating}
          </span>
          <span>{movie.duration}</span>
        </div>
      </div>

      {/* Premium Cinematic Hover Menu Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-zinc-950/95 flex flex-col justify-between p-4 animate-fade-in z-20">
          <div className="space-y-1">
            <h4 className="text-white font-bold text-sm sm:text-base leading-tight pr-4 truncate">
              {movie.title}
            </h4>
            <p className="text-[10px] text-zinc-400 line-clamp-3 sm:line-clamp-4 leading-normal font-sans">
              {movie.description}
            </p>
          </div>

          <div className="space-y-3">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] sm:text-[10px] text-zinc-400 font-medium">
              <span className="text-emerald-500 font-bold">{matchPercentage}% Match</span>
              <span className="px-1 rounded border border-zinc-800 bg-zinc-900 text-[8px] font-bold">
                {movie.maturityRating}
              </span>
              <span>{movie.duration}</span>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex items-center justify-between border-t border-zinc-900 pt-2.5">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('movie-details', movie.id);
                  }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition shadow-md active:scale-95"
                  title="Play/Watch Trailer"
                >
                  <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(movie.id);
                  }}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition active:scale-95 ${
                    isFavorite
                      ? 'bg-red-600/10 border-red-500 text-red-500 hover:bg-red-600/20'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                  title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  {isFavorite ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('movie-details', movie.id);
                }}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-center transition active:scale-95"
                title="More Details"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
