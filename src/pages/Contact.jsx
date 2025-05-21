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
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-white to-blue-100 p-6"
    >
      <div className="bg-white shadow-xl rounded-xl max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Left Panel - Contact Info */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-400 text-white p-10 space-y-6 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Let us get in touch</h2>
            <p className="text-sm">Feel free to reach us via email or social links below.</p>
          </div>
          <div>
            <p className="text-white font-semibold">📍 Address</p>
            <p className="text-sm">Beirut, Lebanon</p>
          </div>
          <div>
            <p className="text-white font-semibold">📧 Email</p>
            <p className="text-sm">info@ziyarah.app</p>
          </div>
          <div className="flex gap-4 text-white text-lg mt-4">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin-in"></i>
          </div>
        </div>

        {/* Right Panel - Contact Form */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Us</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300" />
            <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300" />
            <input type="text" placeholder="Subject" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300" />
            <textarea placeholder="Your Message..." rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"></textarea>
            <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition duration-300">Send Message</button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-purple-600 hover:underline">← Back to Home</Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Contact;
