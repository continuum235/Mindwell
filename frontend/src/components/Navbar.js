// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) => `
    relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300
    ${isActive(path) 
      ? 'text-primary-600 border-b-2 border-primary-600' 
      : 'text-neutral-600 border-b-2 border-transparent hover:text-primary-600 hover:border-primary-300'
    }
  `;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass shadow-lg shadow-primary-500/10' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                MindWell
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link to="/" className={navLinkClass('/')}>
                Home
              </Link>
              <Link to="/assessment" className={navLinkClass('/assessment')}>
                Assessment
              </Link>
              <Link to="/stress-management" className={navLinkClass('/stress-management')}>
                Stress Management
              </Link>
              <Link to="/mood-tracker" className={navLinkClass('/mood-tracker')}>
                Mood Tracker
              </Link>
              <Link to="/chatbot" className={navLinkClass('/chatbot')}>
                Chatbot
              </Link>
              <Link to="/about" className={navLinkClass('/about')}>
                About
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-neutral-700 text-sm font-medium">
                  Welcome, {user?.name}
                </span>
                <Link
                  to="/profile"
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with smooth transition */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96' : 'max-h-0'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/assessment"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/assessment')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Assessment
          </Link>
          <Link
            to="/stress-management"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/stress-management')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Stress Management
          </Link>
          <Link
            to="/mood-tracker"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/mood-tracker')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Mood Tracker
          </Link>
          <Link
            to="/chatbot"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/chatbot')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            Chatbot
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
              isActive('/about')
                ? 'bg-primary-100 text-primary-700'
                : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
            }`}
          >
            About
          </Link>
          <div className="pt-4 pb-3 border-t border-primary-100">
            {isLoggedIn ? (
              <div className="space-y-2 px-3">
                <p className="text-sm font-medium text-neutral-700">
                  Welcome, {user?.name}
                </p>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 mx-3"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;