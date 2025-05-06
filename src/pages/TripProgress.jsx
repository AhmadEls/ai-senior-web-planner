import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'sonner';
import { FaMapMarkerAlt, FaUpload, FaTrash, FaCheckCircle } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TripProgress() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [highlightComment, setHighlightComment] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTrip(data);
          setPhotos(data.photos || []);
          setCompletedItems(data.completedItems || []);
        } else {
          toast.error('Trip not found.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error fetching trip.');
      }
    };
    fetchTrip();
  }, [tripId]);

  const extractAllItems = () => {
    if (!trip) return [];

    let hotels = [];
    let activities = [];

    try {
      const tripData = typeof trip.tripData === 'string' ? JSON.parse(trip.tripData) : trip.tripData;
      hotels = tripData?.Hotels?.map((hotel, idx) => ({
        id: `hotel-${idx}`,
        name: hotel.HotelName
      })) || [];

      activities = (tripData?.Itinerary || []).flatMap((day, dayIndex) =>
        (day.Activities || []).map((activity, idx) => ({
          id: `day${dayIndex}-activity${idx}`,
          name: activity.PlaceName
        }))
      ) || [];
    } catch (err) {
      console.error('Failed to parse tripData:', err);
    }

    return [...hotels, ...activities];
  };

  const allItems = extractAllItems();
  const progress = allItems.length ? Math.round((completedItems.length / allItems.length) * 100) : 0;

  const toggleChecklist = async (id) => {
    const updated = completedItems.includes(id)
      ? completedItems.filter(item => item !== id)
      : [...completedItems, id];
    setCompletedItems(updated);

    try {
      const tripRef = doc(db, 'AITrips', tripId);
      await updateDoc(tripRef, { completedItems: updated });
    } catch (error) {
      console.error(error);
      toast.error('Failed to update progress.');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const url = event.target.result;
        const tripRef = doc(db, 'AITrips', tripId);
        await updateDoc(tripRef, { photos: arrayUnion(url) });
        setPhotos(prev => [...prev, url]);
        toast.success('Photo uploaded!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (url) => {
    try {
      const tripRef = doc(db, 'AITrips', tripId);
      await updateDoc(tripRef, { photos: arrayRemove(url) });
      setPhotos(prev => prev.filter(p => p !== url));
      toast.success('Photo deleted.');
    } catch (error) {
      console.error(error);
      toast.error('Delete failed.');
    }
  };

  const handlePostHighlight = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please sign in to post a highlight.');
      return;
    }

    if (completedItems.length === 0 || photos.length === 0) {
      toast.error('Please mark visited places and upload at least one photo.');
      return;
    }

    const highlightData = {
      userName: user.name,
      userPhoto: user.picture,
      tripName: trip?.userSelection?.location?.label || 'Unknown Destination',
      completedAt: new Date().toISOString(),
      comment: highlightComment || "Amazing trip!",
      photos: photos,
      visitedPlaces: allItems.filter(item => completedItems.includes(item.id)).map(item => item.name)
    };

    try {
      await addDoc(collection(db, 'TripHighlights'), highlightData);
      toast.success('Trip posted to highlights!');
      setOpenModal(false);
      navigate('/highlights');
    } catch (error) {
      console.error(error);
      toast.error('Failed to post highlight.');
    }
  };

  const handleEndTrip = async () => {
    try {
      const tripRef = doc(db, 'AITrips', tripId);
      await updateDoc(tripRef, {
        tripEnded: true,
        completedItems: completedItems,
        photos: photos
      });
      toast.success('Trip successfully ended!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('Failed to end trip.');
    }
  };

  if (!trip) {
    return <div className="text-center py-20 animate-pulse">Loading trip...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">

      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-800">
          🎒 {trip?.userSelection?.location?.label} Adventure
        </h1>
        <p className="text-gray-500 text-lg">Manage your trip and memories</p>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-4">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{progress}% completed</p>
      </div>

      {/* Trip Details */}
      <div className="bg-white shadow rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">📄 Trip Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Destination:</strong> {trip?.userSelection?.location?.label}</p>
          <p><strong>Budget:</strong> {trip?.userSelection?.budget}</p>
          <p><strong>Travelers:</strong> {trip?.userSelection?.traveler}</p>
          <p><strong>Days:</strong> {trip?.userSelection?.noOfDays}</p>
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">📚 Your Itinerary</h2>
        {allItems.length === 0 ? (
          <p className="text-gray-400">No places available for this trip.</p>
        ) : (
          <div className="space-y-4">
            {allItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${completedItems.includes(item.id) ? 'bg-green-100 border-green-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  {completedItems.includes(item.id) && <FaCheckCircle className="text-green-500 ml-2 animate-bounce" />}
                </div>
                <button
                  onClick={() => toggleChecklist(item.id)}
                  className={`trip-progress-btn ${completedItems.includes(item.id) ? 'visited' : 'not-visited'}`}
                >
                  {completedItems.includes(item.id) ? 'Visited' : 'Mark as Visited'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Memories */}
      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">📸 Trip Memories</h2>
        <label className="flex items-center gap-3 text-blue-600 font-medium cursor-pointer mb-6">
          <FaUpload /> Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {photos.length === 0 ? (
          <p className="text-gray-400 text-center">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt="Memory" className="w-full h-48 object-cover rounded-lg" />
                <button
                  onClick={() => handlePhotoDelete(url)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-4 mt-8">
        <motion.button
          onClick={() => setOpenModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          ✨ Post to Highlights
        </motion.button>

        <motion.button
          onClick={handleEndTrip}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        >
          ✅ End Trip
        </motion.button>
      </div>

      {/* Modal for Highlights */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg space-y-4 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-800">Share your trip experience</h3>
            <textarea
              value={highlightComment}
              onChange={(e) => setHighlightComment(e.target.value)}
              placeholder="Write a short comment about your trip..."
              className="w-full p-3 border rounded-lg"
              rows={4}
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePostHighlight}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Post
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TripProgress;
