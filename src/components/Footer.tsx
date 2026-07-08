/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900/40 text-zinc-500 text-xs py-12 md:py-20 px-4 md:px-12 font-sans relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Social Badges Placeholder */}
        <div className="flex space-x-6 text-zinc-400">
          <span className="hover:text-white transition cursor-pointer font-bold">Facebook</span>
          <span className="hover:text-white transition cursor-pointer font-bold">Instagram</span>
          <span className="hover:text-white transition cursor-pointer font-bold">Twitter / X</span>
          <span className="hover:text-white transition cursor-pointer font-bold">YouTube</span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col space-y-3">
            <span onClick={() => navigateTo('home')} className="hover:underline cursor-pointer">Audio Description</span>
            <span className="hover:underline cursor-pointer">Investor Relations</span>
            <span className="hover:underline cursor-pointer">Legal Notices</span>
            <span className="hover:underline cursor-pointer">CineStream Originals</span>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Help Center</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">System Status</span>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Gift Cards</span>
            <span className="hover:underline cursor-pointer">Shop</span>
            <span className="hover:underline cursor-pointer">Cookie Preferences</span>
            <span className="hover:underline cursor-pointer">Contact Support</span>
          </div>

          <div className="flex flex-col space-y-3">
            <span className="hover:underline cursor-pointer">Media Center</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span className="hover:underline cursor-pointer">Corporate Information</span>
            <span className="hover:underline cursor-pointer">DRF API Config</span>
          </div>
        </div>

        {/* Code Notice & Credits */}
        <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-zinc-400 font-semibold text-sm">CineStream Streaming Platform</p>
            <p className="text-zinc-600 leading-relaxed max-w-2xl">
              Prepared as a production-quality frontend, built using React, TypeScript, and Tailwind CSS. All services are scaffolded to bind cleanly with Django REST Framework SimpleJWT endpoints.
            </p>
          </div>
          <div className="shrink-0 text-left md:text-right">
            <span className="inline-block px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[10px] uppercase">
              VITE ENVIRONMENT
            </span>
            <p className="text-zinc-600 mt-2 text-[10px]">© 2026 CineStream Inc. All rights reserved.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};
