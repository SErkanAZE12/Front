/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorUI } from './components/ErrorUI';

// Pages
import { Home } from './components/pages/Home';
import { MovieDetails } from './components/pages/MovieDetails';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Profile } from './components/pages/Profile';
import { Search } from './components/pages/Search';

function AppContent() {
  const { currentPage, error, setError } = useApp();

  // Render active page based on routing state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'movies':
      case 'tv-shows':
      case 'search':
        return <Search />;
      case 'movie-details':
        return <MovieDetails />;
      case 'profile':
        return <Profile />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans flex flex-col justify-between overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Persistent Sticky Blur Glass Navigation Header */}
      <Navbar />

      {/* Global Visual Error Banners */}
      {error && (
        <div className="pt-24">
          <ErrorUI 
            message={error} 
            onDismiss={() => setError(null)} 
          />
        </div>
      )}

      {/* Core Dynamic Content Stage */}
      <main className="flex-grow transition-all duration-300">
        {renderPage()}
      </main>

      {/* Persistent Low-Contrast Footer Frame */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
