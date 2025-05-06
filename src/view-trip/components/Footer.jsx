import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="py-10 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-12"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-600">
        {/* Branding */}
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Ziyarah</h2>
          <p className="mt-2 text-gray-500">AI-powered travel planner focused on Lebanon. Discover, customize, and explore the country like never before.</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-blue-600 transition">Home</a></li>
            <li><a href="/create-trip" className="hover:text-blue-600 transition">Create Trip</a></li>
            <li><a href="/my-trips" className="hover:text-blue-600 transition">My Trips</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">About</h3>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-blue-600 transition">About Ziyarah</a></li>
            <li><a href="/contact" className="hover:text-blue-600 transition">Contact</a></li>
            <li><a href="/feedback" className="hover:text-blue-600 transition">Feedback</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-10">
        <p>Created by Ahmad Sabeh | AI Travel Planner App</p>
        <p className="mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
