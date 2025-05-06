import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-6 py-16 text-gray-800"
    >
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        We'd love to hear from you! Whether you have questions, feedback, or suggestions, feel free to reach out.
      </p>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <p className="text-gray-600">
          📧 Email us directly at: 
          <a href="mailto:info@ziyarah.app" className="text-blue-600 hover:underline ml-2">
            info@ziyarah.app
          </a>
        </p>
        <p className="text-gray-600">📍 Based in: Beirut, Lebanon</p>
        <p className="text-gray-600">💬 You can also reach out through our social channels coming soon!</p>
      </div>

      <div className="text-center mt-8">
          <Link
                to="/"
                className="back-to-home-btn"
              >
          ← Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default Contact;
