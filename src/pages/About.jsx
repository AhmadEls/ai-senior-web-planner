import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto px-6 py-16 text-gray-800"
    >
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">About Ziyarah</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        Ziyarah is your personalized travel planner designed specifically for exploring Lebanon. Our mission is to make trip planning seamless, intelligent, and inspiring through AI-generated itineraries tailored to your interests, budget, and style.
      </p>

      <div className="grid sm:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">✨ Smart Planning</h2>
          <p className="text-gray-600">We use AI to help you build optimized and meaningful itineraries that suit your travel preferences in seconds.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">🇱🇧 Lebanon-Focused</h2>
          <p className="text-gray-600">Whether it’s the mountains, coastlines, ruins, or cuisine, Ziyarah celebrates the beauty of Lebanon in every itinerary.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">🎯 Fully Customizable</h2>
          <p className="text-gray-600">Need to plan a romantic getaway or a family trip? Ziyarah adapts to all kinds of travel goals with just a few clicks.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">🚀 Continuous Improvement</h2>
          <p className="text-gray-600">We’re constantly updating Ziyarah to bring smarter features and better local suggestions from real data.</p>
        </div>
      </div>

      <div className="text-center">
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

export default About;