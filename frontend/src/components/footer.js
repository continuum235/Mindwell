// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  return (
    <footer className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
              MindWell
            </Link>
            <p className="mt-2 text-white/90">
              Your mental wellness companion. Supporting your journey to better mental health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <p className="text-white/80">
              Have questions? We're here to help you on your wellness journey.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-sm text-white/80">
              © {currentYear} MindWell. Your mental wellness companion. Built with care for your wellbeing.
            </p>
            <div className="mt-4 md:mt-0 text-sm text-white/80">
              <span>Designed to support your mental health journey</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

