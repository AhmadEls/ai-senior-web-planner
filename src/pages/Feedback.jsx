import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Feedback() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-purple-50 px-6 py-16"
    >
      <div className="bg-white shadow-xl rounded-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left panel with header & description */}
        <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-purple-600 to-indigo-500 text-white">
          <h2 className="text-3xl font-bold mb-3">We Value Your Feedback</h2>
          <p className="text-sm">Let us know how your journey with Ziyarah has been. Your thoughts help us grow and improve.</p>
          <div className="mt-6 text-sm">
            <p className="font-semibold">📧 Email</p>
            <a 
              href="mailto:feedback@ziyarah.app" 
              className="text-white hover:underline"
            >
              feedback@ziyarah.app
            </a>
          </div>
          <div className="mt-4 text-sm">
            ✅ Every message is read and appreciated.
          </div>
        </div>

        {/* Right panel with a simple feedback form UI */}
        <div className="p-8 bg-white flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Feedback</h3>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <textarea 
              placeholder="What would you like to share with us?" 
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            ></textarea>
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Submit Feedback
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-purple-600 hover:underline">← Back to Home</Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Feedback;
