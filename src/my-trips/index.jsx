// index.jsx
import { db } from '@/firebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './UserTripCardItem';
import { X } from 'lucide-react'; // Added missing import

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate('/login');
          return;
        }
        const q = query(
          collection(db, 'AITrips'),
          where('userEmail', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
        const trips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        setUserTrips(trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTrips();
  }, [navigate]);

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, 'AITrips', tripId));
      setUserTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Trip History</h1>
        <p className="mt-2 text-gray-600">Review and manage your planned trips</p>
      </div>

      {userTrips.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">You don't have any trips yet</p>
          <button 
            onClick={() => navigate('/create-trip')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            Plan New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userTrips.map((trip) => (
            <div className="relative group transition-transform duration-200 hover:scale-[1.02]" key={trip.id}>
              <button
                onClick={() => handleDeleteTrip(trip.id)}
                className="absolute top-3 right-3 z-10 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 hidden group-hover:block transition-colors duration-200 shadow-md"
                aria-label="Delete trip"
              >
                <X className="w-4 h-4" />
              </button>
              <UserTripCardItem 
                trip={trip} 
                onViewDetails={() => navigate(`/view-trip/${trip.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;