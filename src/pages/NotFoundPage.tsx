import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fd] dark:bg-[#0a1220] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#1673CA]/10 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-[#1673CA]" />
        </div>
        <h1 className="text-7xl font-black text-[#1673CA] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Looks like you've wandered off the career path. Let's get you back on track!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1673CA] rounded-lg hover:bg-[#0d4f8c] transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
