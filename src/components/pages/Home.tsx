/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX, Star, HelpCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MovieRow } from '../MovieRow';
import { HeroSkeleton, RowSkeleton } from '../Skeleton';

export const Home = () => {
  const { movies, loadingMovies, navigateTo, toggleFavorite, user, recordWatchProgress } = useApp();
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Set first movie or highly popular one as featured on mount
  useEffect(() => {
    if (movies.length > 0) {
      const topMovie = movies.find(m => m.id === 'm1') || movies[0];
      setFeaturedMovie(topMovie);
    }
  }, [movies]);

  if (loadingMovies || !featuredMovie) {
    return (
      <div className="bg-zinc-950 min-h-screen text-white pt-20">
        <HeroSkeleton />
        <RowSkeleton title="Trending Now" />
        <RowSkeleton title="Popular Movies" />
      </div>
    );
  }

  // Row filtering by attributes
  const trendingMovies = movies.filter(m => m.isTrending);
  const popularMovies = movies.filter(m => m.isPopular);
  const topRatedMovies = movies.filter(m => m.isTopRated);
  const actionMovies = movies.filter(m => m.genres.includes('Action'));
  const comedyMovies = movies.filter(m => m.genres.includes('Comedy'));
  const dramaMovies = movies.filter(m => m.genres.includes('Drama'));
  const documentaries = movies.filter(m => m.genres.includes('Documentaries'));

  const matchPercentage = Math.floor(featuredMovie.rating * 10 + 9);

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-20 font-sans overflow-hidden">
      
      {/* 1. Large Featured Movie Banner (Hero) */}
      <section className="relative w-full h-[56.25vw] min-h-[460px] max-h-[850px] flex items-end pb-12 sm:pb-24 px-4 md:px-12 select-none">
        
        {/* Background Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover brightness-75 scale-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Gradients to blend image into black background */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Hero Details Card */}
        <div className="max-w-3xl space-y-4 md:space-y-6 relative z-10">
          {/* Categories tag */}
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-black uppercase tracking-widest">
              {featuredMovie.category}
            </span>
            <span className="flex items-center space-x-1 text-xs text-yellow-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              <span>{featuredMovie.rating} Rating</span>
            </span>
            <span className="text-emerald-500 font-bold text-xs">{matchPercentage}% Match</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-zinc-100 drop-shadow-lg">
            {featuredMovie.title}
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-2xl font-normal drop-shadow-md">
            {featuredMovie.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center space-x-3 text-xs text-zinc-400">
            <span className="text-zinc-300 font-semibold">{featuredMovie.year}</span>
            <span className="px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-[10px] font-bold">
              {featuredMovie.maturityRating}
            </span>
            <span>{featuredMovie.duration}</span>
            <span className="text-zinc-500">•</span>
            <span className="truncate max-w-[200px]">{featuredMovie.genres.join(', ')}</span>
          </div>

          {/* Interactive Hero Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => setIsPlayingVideo(true)}
              className="flex items-center space-x-2 px-6 py-2.5 sm:px-8 sm:py-3 rounded bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-bold transition shadow-lg hover:shadow-white/5 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
              <span>Play Now</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={() => navigateTo('movie-details', featuredMovie.id)}
              className="flex items-center space-x-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 text-xs sm:text-sm font-bold transition border border-zinc-700/50 backdrop-blur-sm active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4 text-white" />
              <span>More Info</span>
            </button>
          </div>
        </div>

        {/* Right side floating sound trigger */}
        <div className="absolute right-4 md:right-12 bottom-12 sm:bottom-24 flex items-center space-x-3 z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-zinc-800 transition active:scale-90 cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="px-3 py-1 bg-zinc-900/80 border-l-4 border-red-600 text-zinc-300 font-semibold text-xs rounded-r">
            {featuredMovie.maturityRating}
          </span>
        </div>
      </section>

      {/* 2. Horizontal Scrolling Content Rows */}
      <section className="-mt-12 sm:-mt-24 relative z-20 space-y-4 md:space-y-6">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular Movies" movies={popularMovies} />
        <MovieRow title="Top Rated Hits" movies={topRatedMovies} />
        <MovieRow title="Action Blockbusters" movies={actionMovies} />
        <MovieRow title="Clever Comedies" movies={comedyMovies} />
        <MovieRow title="Intimate Dramas" movies={dramaMovies} />
        <MovieRow title="Edge of Your Seat Thrillers" movies={movies.filter(m => m.genres.includes('Thriller & Suspense'))} />
        <MovieRow title="Provocative Documentaries" movies={documentaries} />
      </section>

      {/* 3. Embedded Cinema Player Modal */}
      {isPlayingVideo && featuredMovie.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Close Trigger */}
            <button
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-zinc-800 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Node */}
            <video
              src={featuredMovie.videoUrl}
              autoPlay
              controls
              muted={isMuted}
              className="w-full h-full object-cover"
              onEnded={() => {
                setIsPlayingVideo(false);
                // Record mock progress as completed in Watch History
                recordWatchProgress(featuredMovie.id, 100);
              }}
              onPlay={() => {
                // Record mock progress as started in Watch History
                recordWatchProgress(featuredMovie.id, 5);
              }}
            />

            {/* Player Overlay Header Details */}
            <div className="absolute bottom-16 left-6 right-6 bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-zinc-800/40 hidden sm:flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-red-500 font-extrabold uppercase tracking-widest">Now Streaming</p>
                <h4 className="text-white font-bold text-lg">{featuredMovie.title}</h4>
              </div>
              <div className="text-zinc-400 text-xs flex items-center space-x-3 font-mono">
                <span>{featuredMovie.duration}</span>
                <span>•</span>
                <span>{featuredMovie.maturityRating}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
