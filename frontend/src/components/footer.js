
// components/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm">
            © {currentYear} MindWell. Your mental wellness companion. Built with care for your wellbeing.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

