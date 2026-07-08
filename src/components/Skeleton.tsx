/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[260px] aspect-[16/9] rounded-md bg-zinc-900 border border-zinc-800/50 animate-pulse overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800/50 to-zinc-900 bg-[length:200%_100%] animate-shimmer" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
        <div className="flex items-center space-x-2">
          <div className="h-2.5 bg-zinc-800 rounded w-1/4" />
          <div className="h-2.5 bg-zinc-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const RowSkeleton = ({ title }: { title?: string }) => {
  return (
    <div className="space-y-4 py-4 px-4 md:px-12">
      {title ? (
        <div className="h-6 bg-zinc-950/40 border border-zinc-800/10 rounded w-48 animate-pulse" />
      ) : (
        <div className="h-6 bg-zinc-900 rounded w-32 animate-pulse" />
      )}
      <div className="flex space-x-4 overflow-x-hidden pb-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="w-full h-[56.25vw] min-h-[400px] max-h-[800px] bg-zinc-950 relative flex items-end pb-12 sm:pb-24 px-4 md:px-12 animate-pulse border-b border-zinc-900">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950" />
      <div className="max-w-2xl space-y-6 relative z-10 w-full">
        <div className="h-4 bg-zinc-800 rounded w-24" />
        <div className="h-12 md:h-16 bg-zinc-800 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-5/6" />
        </div>
        <div className="flex space-x-4 pt-4">
          <div className="h-12 bg-zinc-800 rounded w-32" />
          <div className="h-12 bg-zinc-800 rounded w-36" />
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white animate-pulse">
      <div className="w-full h-[40vh] sm:h-[60vh] bg-zinc-900 relative" />
      <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-24 sm:-mt-48 relative z-10 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="w-full aspect-[2/3] rounded-lg bg-zinc-900 border border-zinc-800" />
        </div>
        <div className="md:col-span-2 space-y-6 pt-12 md:pt-48">
          <div className="h-10 bg-zinc-900 rounded w-2/3" />
          <div className="flex space-x-4">
            <div className="h-4 bg-zinc-900 rounded w-16" />
            <div className="h-4 bg-zinc-900 rounded w-16" />
            <div className="h-4 bg-zinc-900 rounded w-16" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-900 rounded w-full" />
            <div className="h-4 bg-zinc-900 rounded w-full" />
            <div className="h-4 bg-zinc-900 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
};
