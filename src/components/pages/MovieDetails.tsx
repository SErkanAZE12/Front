/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, ArrowLeft, Clock, Calendar, User, MessageSquare, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { movieService } from '../../services/movieService';
import { Movie, Review } from '../../types';
import { MOCK_REVIEWS } from '../../data/mockData';
import { MovieCard } from '../MovieCard';
import { DetailSkeleton } from '../Skeleton';
import { ErrorUI } from '../ErrorUI';

export const MovieDetails = () => {
  const { currentMovieId, navigateTo, toggleFavorite, user, movies } = useApp();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Review submission state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!currentMovieId) {
        setErrorText('No movie was selected. Please return to the homepage.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorText(null);
        const details = await movieService.getMovieDetails(currentMovieId);
        setMovie(details);
        
        // Filter reviews for this movie
        const movieReviews = MOCK_REVIEWS.filter(r => r.movieId === currentMovieId);
        setLocalReviews(movieReviews);
      } catch (err: any) {
        setErrorText(err.message || 'Failed to retrieve movie details.');
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [currentMovieId]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (errorText || !movie) {
    return (
      <div className="bg-zinc-950 min-h-screen text-white pt-24 px-4 flex flex-col justify-center items-center">
        <ErrorUI message={errorText || 'Movie details not available.'} />
        <button
          onClick={() => navigateTo('home')}
          className="mt-6 px-6 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  const isFavorite = user?.favoriteMovieIds.includes(movie.id) || false;
  const matchPercentage = Math.floor(movie.rating * 10 + 9);

  // Fetch similar movies (excluding itself, matching at least one genre or category)
  const similarMovies = movies
    .filter(m => m.id !== movie.id && (m.category === movie.category || m.genres.some(g => movie.genres.includes(g))))
    .slice(0, 4);

  // Submit a review locally
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigateTo('login');
      return;
    }
    if (newComment.trim().length < 5) {
      alert('Please enter a constructive review (minimum 5 characters).');
      return;
    }

    setIsSubmittingReview(true);
    
    setTimeout(() => {
      const submitted: Review = {
        id: 'r_new_' + Math.random().toString(36).substr(2, 9),
        movieId: movie.id,
        username: user.username,
        userAvatar: user.avatarUrl,
        rating: newRating,
        comment: newComment,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setLocalReviews(prev => [submitted, ...prev]);
      setNewComment('');
      setNewRating(5);
      setIsSubmittingReview(false);
    }, 500);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pb-20 font-sans relative">
      
      {/* 1. Large Hero Backdrop */}
      <section className="relative w-full h-[40vh] sm:h-[60vh] overflow-hidden select-none">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
        
        {/* Navigation Back Button */}
        <button
          onClick={() => navigateTo('home')}
          className="absolute top-24 left-4 md:left-12 z-20 flex items-center space-x-2 px-3 py-1.5 rounded bg-black/60 hover:bg-black/85 text-zinc-300 hover:text-white transition border border-zinc-800 backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">Browse Titles</span>
        </button>
      </section>

      {/* 2. Detailed Metadata Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 -mt-24 sm:-mt-40 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Left Column: Poster Image */}
        <div className="md:col-span-1 hidden md:block">
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl relative group">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition scale-90 group-hover:scale-100"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & Overview */}
        <div className="md:col-span-2 space-y-6 pt-10 md:pt-20">
          
          <div className="space-y-3">
            {/* Action Meta Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-400">
              <span className="text-emerald-500 font-bold">{matchPercentage}% Match</span>
              <span className="flex items-center space-x-1 font-bold text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-yellow-500" />
                <span>{movie.rating}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{movie.year}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{movie.duration}</span>
              </span>
              <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[10px] font-bold">
                {movie.maturityRating}
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-zinc-100 drop-shadow">
              {movie.title}
            </h2>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 border-y border-zinc-900/60 py-4">
            <button
              onClick={() => setIsPlayingVideo(true)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-red-600/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
              <span>Watch Now (Trailer)</span>
            </button>

            <button
              onClick={() => toggleFavorite(movie.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded border text-xs sm:text-sm font-bold transition cursor-pointer ${
                isFavorite
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 hover:bg-emerald-600/20'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {isFavorite ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
            </button>
          </div>

          {/* Summary Synopsis */}
          <div className="space-y-2">
            <h4 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Synopsis</h4>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans font-light">
              {movie.description}
            </p>
          </div>

          {/* Cast & Director Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm border-t border-zinc-900/60 pt-4">
            <div className="space-y-1">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Director</span>
              <p className="text-zinc-300 flex items-center space-x-2">
                <User className="w-4 h-4 text-red-600 shrink-0" />
                <span>{movie.director}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Genres</span>
              <p className="text-zinc-300">{movie.genres.join(', ')}</p>
            </div>
          </div>

          {/* Cast Members section */}
          <div className="space-y-3 pt-4">
            <h4 className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Starring Cast</h4>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:border-zinc-700 hover:text-white transition"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Similar / Recommendations Section */}
      {similarMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16 space-y-4 border-t border-zinc-900/40 mt-16">
          <h3 className="text-zinc-300 font-bold text-lg md:text-xl font-sans tracking-tight">
            More Like This
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarMovies.map((simMovie) => (
              <MovieCard key={simMovie.id} movie={simMovie} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Interactive Comments / Reviews section */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12 border-t border-zinc-900/40">
        <div className="max-w-3xl space-y-8">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <h3 className="text-zinc-200 font-bold text-lg md:text-xl font-sans tracking-tight">
              Viewer Reviews ({localReviews.length})
            </h3>
          </div>

          {/* Submission Form */}
          {user ? (
            <form onSubmit={handleSubmitReview} className="p-4 rounded-lg bg-zinc-950 border border-zinc-900 space-y-4">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Leave a Review</p>
              
              <div className="flex items-center space-x-4">
                <span className="text-xs text-zinc-300 font-medium">Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5 focus:outline-none transition hover:scale-125"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-yellow-500">
                  {newRating}.0 / 10
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on the cinematography, plot, or visual effects..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Posting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900/60 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-500">Sign in to leave reviews and rate this film.</span>
              <button
                onClick={() => navigateTo('login')}
                className="text-red-500 hover:text-red-400 font-bold transition"
              >
                Sign In ›
              </button>
            </div>
          )}

          {/* List of reviews */}
          <div className="space-y-4">
            {localReviews.length === 0 ? (
              <p className="text-zinc-500 text-xs italic">No reviews have been posted for this movie yet. Be the first!</p>
            ) : (
              localReviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-900 flex space-x-4 animate-fade-in text-xs sm:text-sm">
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <img
                      src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={review.username}
                      className="w-10 h-10 rounded-full border border-zinc-800 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Body */}
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-200 font-bold">{review.username}</span>
                      <span className="text-[10px] text-zinc-500">{review.createdAt}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span className="font-mono font-bold">{review.rating}.0 / 10</span>
                    </div>

                    <p className="text-zinc-400 leading-relaxed font-sans">{review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Cinema Player Overlay */}
      {isPlayingVideo && movie.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            <button
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 border border-zinc-800 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
            >
              ✕
            </button>

            <video
              src={movie.videoUrl}
              autoPlay
              controls
              className="w-full h-full object-cover"
              onEnded={() => setIsPlayingVideo(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
