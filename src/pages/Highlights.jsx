import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Highlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const highlightsQuery = query(
          collection(db, 'TripHighlights'),
          orderBy('completedAt', 'desc')
        );
        const snapshot = await getDocs(highlightsQuery);
        const highlightsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHighlights(highlightsData);

        const placesCount = {};
        highlightsData.forEach(highlight => {
          if (highlight.visitedPlaces) {
            highlight.visitedPlaces.forEach(place => {
              placesCount[place] = (placesCount[place] || 0) + 1;
            });
          }
        });

        const sortedPlaces = Object.entries(placesCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([place]) => place);

        setPopularPlaces(sortedPlaces);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  const handleCardClick = (highlight) => {
    navigate(`/highlight-details/${highlight.id}`, { state: { highlight } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🌟 Trip Highlights
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover inspiring travel experiences shared by our community of adventurers.
        </p>
      </div>

      {highlights.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 text-center space-y-6">
          <div className="bg-blue-100 p-6 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Highlights Yet ✨</h2>
          <p className="text-gray-600 max-w-md">When users complete and share their trips, the highlights will appear here.</p>
          <button 
            onClick={() => navigate('/')}
            className="button-primary"
          >
            Start Planning Your Trip
          </button>
        </div>
      ) : (
        <>
          {/* Popular Places Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔥 Popular Places in Lebanon</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {popularPlaces.length > 0 ? (
                popularPlaces.map((place, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition"
                  >
                    <div className="bg-blue-100 w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-gray-800">{place}</h3>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No popular places data yet</p>
              )}
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ Recent Trip Highlights</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(highlight)}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                    <img
                      src={highlight.userPhoto || '/default-user.jpg'}
                      alt={highlight.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{highlight.userName}</h3>
                      <p className="text-sm text-gray-500">{highlight.tripName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(highlight.completedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-gray-700 ml-2 line-clamp-3">"{highlight.comment || 'No comment provided'}"</p>
                    </div>

                    {/* Images Preview */}
                    {highlight.photos && highlight.photos.length > 0 && (
                      <div className="relative">
                        <div className="grid grid-cols-2 gap-2">
                          {highlight.photos.slice(0, 4).map((photo, idx) => (
                            <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                              <img src={photo} alt="Trip memory" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        {highlight.photos.length > 4 && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            +{highlight.photos.length - 4} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Visited Places */}
                    {highlight.visitedPlaces && (
                      <div className="pt-2 flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Visited {highlight.visitedPlaces.length} places
                      </div>
                    )}
                  </div>

                  {/* Card Footer Button */}
                  <div className="mt-auto p-4 bg-gray-50 border-t border-gray-100">
                    <button className="button-outline w-full text-center">
                      View Full Details →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 text-center text-white mt-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to create your own adventure?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Plan your perfect trip to Lebanon and share your experiences with our community.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="button-primary"
            >
              Start Planning Now
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Highlights;
