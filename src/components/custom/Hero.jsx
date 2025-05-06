import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GiMountainCave, GiGreekTemple, GiShinyApple, GiCampingTent } from 'react-icons/gi';

const backgrounds = ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg'];

function Hero() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleJourneyClick = () => {
    if (!user) {
      alert('Please sign in to begin your journey.');
    } else {
      navigate('/create-trip');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Lebanon scenery"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 z-10"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center text-white py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/95 text-gray-900 rounded-full shadow-sm backdrop-blur-sm border border-white/20"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium tracking-wide">
              Lebanon's Premier AI Trip Planner
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-8 tracking-tight">
            <span className="block text-white drop-shadow-lg">Discover Lebanon's</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mt-3">
              Hidden Treasures
            </span>
          </h1>

          <motion.p
            className="text-xl text-gray-100 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your journey starts here. Explore iconic landmarks, savor local flavors, and personalize every stop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col items-center"
          >
            <Button
              onClick={handleJourneyClick}
              className="group px-8 py-3.5 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin Your Journey
            </Button>

            {/* What You'll Discover Section */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white">
              <div className="flex flex-col items-center">
                <GiMountainCave className="text-4xl mb-2 text-blue-300" />
                <span className="text-sm font-medium">Scenic Mountains</span>
              </div>
              <div className="flex flex-col items-center">
                <GiGreekTemple className="text-4xl mb-2 text-blue-300" />
                <span className="text-sm font-medium">Ancient Temples</span>
              </div>
              <div className="flex flex-col items-center">
                <GiShinyApple className="text-4xl mb-2 text-blue-300" />
                <span className="text-sm font-medium">Local Flavors</span>
              </div>
              <div className="flex flex-col items-center">
                <GiCampingTent className="text-4xl mb-2 text-blue-300" />
                <span className="text-sm font-medium">Adventure Sites</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
