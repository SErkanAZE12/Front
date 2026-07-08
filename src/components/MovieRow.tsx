/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export const MovieRow = ({ title, movies }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  if (movies.length === 0) {
    return null;
  }

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 10);
    }
  };

  const handleSlide = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollOffset = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-2 py-4 px-4 md:px-12 relative group/row">
      {/* Row Header */}
      <h3 className="text-zinc-100 font-sans font-bold text-sm sm:text-base md:text-xl tracking-tight hover:text-white transition cursor-pointer flex items-center space-x-1">
        <span>{title}</span>
        <span className="text-red-600 font-black text-xs md:text-sm tracking-widest opacity-0 group-hover/row:opacity-100 transition duration-300 ml-1">
          EXPLORE ›
        </span>
      </h3>

      {/* Row Outer Wrapper for Slides */}
      <div className="relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleSlide('left')}
            className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-black/60 hover:bg-black/85 text-white z-10 flex items-center justify-center transition opacity-0 group-hover/row:opacity-100 border-r border-zinc-900/50 rounded-r-md backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 active:scale-95 transition" />
          </button>
        )}

        {/* Right Arrow Button */}
        <button
          onClick={() => handleSlide('right')}
          className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-black/60 hover:bg-black/85 text-white z-10 flex items-center justify-center transition opacity-0 group-hover/row:opacity-100 border-l border-zinc-900/50 rounded-l-md backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 active:scale-95 transition" />
        </button>

        {/* Horizontal Scrolling Card Container */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 pt-1 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default MovieRow;
