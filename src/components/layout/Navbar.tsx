import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Compass } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Features', href: '/#features' },
  { label: 'Find a Mentor', href: '/mentors' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { hasProfile } = useProfile();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); return; }
    }
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#1673CA] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              NX <span className="text-[#1673CA]">RaahNuma</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#1673CA] dark:hover:text-[#1673CA] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              to={hasProfile ? '/dashboard' : '/onboarding'}
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#1673CA] rounded-lg hover:bg-[#0d4f8c] transition-colors shadow-md shadow-blue-500/20"
            >
              {hasProfile ? 'Dashboard' : 'Get Started Free'}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {isLanding && NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#1673CA]/10 hover:text-[#1673CA] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={hasProfile ? '/dashboard' : '/onboarding'}
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[#1673CA] rounded-lg hover:bg-[#0d4f8c] mt-2"
            >
              {hasProfile ? 'Dashboard' : 'Get Started Free'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
