import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiMapPin, FiCalendar, FiUser, FiStar, FiHeart, FiX, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

function HighlightDetail() {
  const { highlightId } = useParams();
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredPlace, setHoveredPlace] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHighlightDetails = async () => {
      try {
        const highlightRef = doc(db, 'TripHighlights', highlightId);
        const highlightSnap = await getDoc(highlightRef);
        if (highlightSnap.exists()) {
          setHighlight({
            ...highlightSnap.data(),
            weather: 'Sunny, 24°C',
            duration: '5 days',
            rating: 4.5,
          });
        } else {
          console.log('No such highlight!');
        }
      } catch (error) {
        console.error('Error fetching highlight details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlightDetails();
  }, [highlightId]);

  const openCarousel = (index) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateCarousel = (direction) => {
    if (!highlight?.photos) return;
    setCurrentImageIndex(prev =>
      direction === 'prev'
        ? (prev === 0 ? highlight.photos.length - 1 : prev - 1)
        : (prev === highlight.photos.length - 1 ? 0 : prev + 1)
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-gray-600"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></motion.div>
      </motion.div>
    );
  }

  if (!highlight) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-gray-600"
      >
        <p>No highlight found!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Hover Map Container */}
      {hoveredPlace && (
        <div className="fixed top-32 right-10 z-50 w-[400px] h-[300px] border border-gray-300 shadow-lg rounded-lg overflow-hidden bg-white">
          <iframe
            title={hoveredPlace}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(hoveredPlace + ' Lebanon')}&output=embed`}
          ></iframe>
        </div>
      )}

      {/* Image Carousel Modal */}
      {carouselOpen && highlight.photos && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button onClick={closeCarousel} className="absolute top-6 right-6 text-white">
            <FiX size={28} />
          </button>
          <button onClick={() => navigateCarousel('prev')} className="absolute left-6 text-white p-2">
            <FiChevronLeft size={32} />
          </button>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl w-full mx-4"
          >
            <img
              src={highlight.photos[currentImageIndex]}
              alt={`Trip memory ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center text-white mt-4">
              {currentImageIndex + 1} / {highlight.photos.length}
            </div>
          </motion.div>
          <button onClick={() => navigateCarousel('next')} className="absolute right-6 text-white p-2">
            <FiChevronRight size={32} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-white px-6 py-2 rounded-full shadow-sm mb-4">
            <FiUser className="text-blue-500 mr-2" />
            <span className="text-gray-700">{highlight.userName}'s Travel Highlight</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{highlight.tripName}</h1>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Trip Summary</h2>
              <p>Duration: {highlight.duration} | Weather: {highlight.weather} | Rating: {highlight.rating}/5</p>
            </div>
            <motion.button
              whileHover={{ scale: user ? 1.05 : 1 }}
              whileTap={{ scale: user ? 0.95 : 1 }}
              onClick={() => user && setLiked(!liked)}
              disabled={!user}
              className={`flex items-center px-4 py-2 rounded-full ${liked ? 'bg-pink-100 text-pink-600' : 'bg-white text-gray-700'} ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <FiHeart className={`mr-2 ${liked ? 'fill-current' : ''}`} />
              {liked ? 'Liked' : 'Like this trip'}
            </motion.button>
          </div>

          <div className="p-6 space-y-8">
            {highlight.comment && (
              <div className="bg-blue-50 rounded-xl p-6 italic text-gray-700">"{highlight.comment}"</div>
            )}

            {highlight.photos && highlight.photos.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Memories Captured</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highlight.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer"
                      onClick={() => openCarousel(index)}
                    >
                      <img
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highlight.visitedPlaces && highlight.visitedPlaces.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Journey Map</h3>
                <ul className="space-y-3">
                  {highlight.visitedPlaces.map((place, idx) => (
                    <motion.li
                      key={idx}
                      onMouseEnter={() => setHoveredPlace(place)}
                      onMouseLeave={() => setHoveredPlace(null)}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.1 + idx * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 font-bold">{idx + 1}</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-800">{place}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Travel Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Best Moments</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Sunset at the beach</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Local food tasting</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Mountain hike adventure</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">Travel Tips</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Best time to visit: March-May</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Must-try: Local seafood</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Transportation: Rent a bike</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>Relive your memories • Share your journey • Plan your next adventure</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HighlightDetail;