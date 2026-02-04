# MindWell Enhanced Component Templates
## Refined Frontend with Smooth Animations

---

## Installation & Setup

### 1. Install Additional Dependencies

```bash
cd frontend

# Install animation library
npm install framer-motion

# Install additional utilities
npm install clsx tailwind-merge

# Optional: Install icon library for better icons
npm install lucide-react
```

### 2. Update Tailwind Configuration

**File: `frontend/tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Calming Teal
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Accent - Warm Purple
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Support - Soft Green
        support: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-scale': 'fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
```

### 3. Update Global CSS

**File: `frontend/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* Custom scrollbar */
@layer base {
  * {
    @apply scroll-smooth;
  }
  
  body {
    @apply text-neutral-900 antialiased;
  }
  
  ::-webkit-scrollbar {
    @apply w-2;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-neutral-100;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-primary-500 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-primary-600;
  }
}

/* Utility classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .glass {
    @apply bg-white/80 backdrop-blur-md border border-white/20;
  }
  
  .glass-dark {
    @apply bg-neutral-900/80 backdrop-blur-md border border-white/10;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .animate-breathe,
  .animate-gentle-bounce {
    animation: none !important;
  }
}

/* Focus visible improvements */
*:focus-visible {
  @apply outline-2 outline-primary-500 outline-offset-4 rounded;
}

button:focus-visible {
  @apply outline-3 outline-primary-500 outline-offset-2 shadow-[0_0_0_4px_rgba(20,184,166,0.2)];
}
```

---

## Enhanced Components

### 1. Improved Home Page with Animations

**File: `frontend/src/pages/Home.js`**

```jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  ClipboardCheck, 
  Brain, 
  TrendingUp, 
  MessageCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

// Hero Section with Animated Text
const HeroSection = () => {
  const words = ["Mental", "Wellness", "Journey"];
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-support-50">
        {/* Floating Blobs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Welcome to MindWell
          </span>
        </motion.div>
        
        <div className="mb-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900">
            <span className="block mb-2">Your</span>
            {words.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="block relative inline-block"
              >
                <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent">
                  {word}
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2 + 0.3,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"
                />
              </motion.span>
            ))}
            <span className="block mt-2">Starts Here</span>
          </h1>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Access tools for assessment, stress management, mood tracking, 
          and personalized support — all in one place.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/assessment"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-full font-semibold text-lg border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
          >
            Learn More
          </Link>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary-400 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Features Section with Stagger Animation
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: ClipboardCheck,
      title: "Mental Health Assessment",
      description: "Take our comprehensive assessment to understand your current mental wellness status.",
      link: "/assessment",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Stress Management",
      description: "Access techniques and exercises to manage and reduce stress in your daily life.",
      link: "/stress-management",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Mood Tracker",
      description: "Track your mood patterns over time to identify triggers and improve emotional awareness.",
      link: "/mood-tracker",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "Support Chatbot",
      description: "Get immediate support and guidance through our AI-powered mental health chatbot.",
      link: "/chatbot",
      color: "from-orange-500 to-red-500"
    },
  ];
  
  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Our Features
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Comprehensive tools designed to support your mental wellness journey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index, isInView }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Link
        to={feature.link}
        className="group block h-full p-8 bg-gradient-to-br from-white to-neutral-50 rounded-2xl border border-neutral-200 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
      >
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">
          {feature.title}
        </h3>
        
        <p className="text-neutral-600 mb-4 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
          Try now
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};

// Stats Section
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const stats = [
    { number: "50K+", label: "Users Supported", suffix: "" },
    { number: "24", label: "Hours Available", suffix: "/7" },
    { number: "95", label: "User Satisfaction", suffix: "%" },
    { number: "100", label: "Confidential", suffix: "%" },
  ];
  
  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary-600 to-accent-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stat.number}
                <span className="text-3xl">{stat.suffix}</span>
              </div>
              <div className="text-primary-100 font-medium text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of others who are taking control of their mental health with MindWell
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-500 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-primary-500/30"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-neutral-900 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
```

---

### 2. Enhanced Navbar with Glass Effect

**File: `frontend/src/components/Navbar.js`**

```jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Assessment', path: '/assessment' },
    { name: 'Stress Management', path: '/stress-management' },
    { name: 'Mood Tracker', path: '/mood-tracker' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
            >
              MindWell
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-neutral-600 hover:text-primary-600 font-medium transition-colors group"
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-neutral-600 text-sm">
                  Welcome, <span className="font-semibold">{user?.name}</span>
                </span>
                <Link
                  to="/profile"
                  className="p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium hover:bg-primary-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-neutral-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <p className="px-4 text-sm text-neutral-600">
                      Welcome, <span className="font-semibold">{user?.name}</span>
                    </p>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg font-medium hover:bg-primary-200 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
```

---

### 3. Utility Hook for Scroll Animations

**File: `frontend/src/hooks/useScrollAnimation.js`** (create this file)

```javascript
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once) {
            observer.disconnect();
          }
        } else if (!options.once) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isVisible];
};
```

---

### 4. Animation Wrapper Component

**File: `frontend/src/components/AnimatedSection.js`** (create this file)

```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = '',
  delay = 0,
  animation = 'fadeInUp' 
}) => {
  const [ref, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
  };

  const selectedAnimation = animations[animation] || animations.fadeInUp;

  return (
    <motion.div
      ref={ref}
      initial={selectedAnimation.initial}
      animate={isVisible ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
```

---

## Usage Instructions

### 1. Update App.js

```jsx
// Update imports at the top
import { motion, AnimatePresence } from 'framer-motion';

// Wrap routes with AnimatePresence for page transitions
<AnimatePresence mode="wait">
  <Routes>
    {/* your routes */}
  </Routes>
</AnimatePresence>
```

### 2. Add Page Transitions

Wrap each page component:

```jsx
import { motion } from 'framer-motion';

const YourPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* page content */}
    </motion.div>
  );
};
```

### 3. Use AnimatedSection Component

```jsx
import AnimatedSection from '../components/AnimatedSection';

<AnimatedSection animation="fadeInUp" delay={0.2}>
  <div className="your-content">
    {/* This will animate when scrolled into view */}
  </div>
</AnimatedSection>
```

---

## Quick Wins Checklist

- [ ] Install framer-motion
- [ ] Update Tailwind config with new colors
- [ ] Replace Home.js with enhanced version
- [ ] Replace Navbar.js with glass effect version
- [ ] Add AnimatedSection component
- [ ] Add useScrollAnimation hook
- [ ] Test animations on different pages
- [ ] Verify reduced-motion support
- [ ] Test mobile responsiveness

---

## Performance Tips

1. **Lazy load Framer Motion** for better initial load:
```javascript
const motion = React.lazy(() => import('framer-motion'));
```

2. **Use CSS animations** for simple effects
3. **Debounce scroll events** for better performance
4. **Use `will-change`** CSS property sparingly
5. **Test on low-end devices**

---

This template provides smooth, professional animations inspired by Ronas IT while maintaining the calming, trustworthy aesthetic appropriate for a mental health platform.
