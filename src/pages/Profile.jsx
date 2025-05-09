import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Make sure auth is exported in your firebaseConfig
import {
  collection,
  query,
  where,
  getDocs,
  // eslint-disable-next-line no-unused-vars
  deleteDoc,
  // eslint-disable-next-line no-unused-vars
  doc,
  writeBatch
} from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import { signOut, deleteUser } from 'firebase/auth';

function Profile() {
  const [myTrips, setMyTrips] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, []);

  const fetchTrips = async () => {
    const tripsRef = collection(db, 'AITrips');
    const q = query(tripsRef, where('userEmail', '==', user.email));
    const querySnapshot = await getDocs(q);
    const trips = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMyTrips(trips);
  };

  const getVisitedPlaceNames = (trip) => {
    if (!trip.completedItems || !trip.tripData) return [];
    let hotels = [];
    let activities = [];
    try {
      const data = typeof trip.tripData === 'string' ? JSON.parse(trip.tripData) : trip.tripData;
      hotels = (data.Hotels || []).map((h, i) => ({ id: `hotel-${i}`, name: h.HotelName }));
      activities = (data.Itinerary || []).flatMap((day, dayIndex) =>
        (day.Activities || []).map((act, idx) => ({ id: `day${dayIndex}-activity${idx}`, name: act.PlaceName }))
      );
    } catch {
      return trip.completedItems.map(id => id);
    }
    const allItems = [...hotels, ...activities];
    return trip.completedItems.map(id => {
      const found = allItems.find(item => item.id === id);
      return found ? found.name : id;
    });
  };

  const generateCertificate = (trip) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const destination = trip?.userSelection?.location?.label || 'Lebanon';
    const completedDate = trip?.completedAt
      ? new Date(trip.completedAt).toLocaleDateString()
      : 'Not available';

    doc.setFillColor(255);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(0, 0, 80);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text('Certificate of Completion', 148, 50, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('This certificate is presented to', 148, 65, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(user?.name || 'An Honored Explorer', 148, 80, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(
      `For completing a journey to ${destination} using Ziyarah.`,
      148,
      95,
      { align: 'center' }
    );

    doc.setFontSize(12);
    doc.text(`Duration: ${trip?.userSelection?.noOfDays || '-'} days`, 30, 120);
    doc.text(`Budget: ${trip?.userSelection?.budget || '-'} USD`, 30, 130);
    doc.text(`Completion Date: ${completedDate}`, 30, 140);

    doc.setLineWidth(0.2);
    doc.setDrawColor(120);
    doc.line(200, 150, 260, 150);
    doc.setFontSize(10);
    doc.text('Ziyarah AI Travel Planner', 230, 157, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Generated by Ziyarah AI Travel Planner', 148, 200, { align: 'center' });

    doc.save(`${destination.replaceAll(' ', '_')}_certificate.pdf`);
  };

  const deleteAccount = async () => {
    if (!user || !window.confirm('Are you sure you want to permanently delete your account and all data? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete all user trips
      const tripsRef = collection(db, 'AITrips');
      const q = query(tripsRef, where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((document) => {
        batch.delete(document.ref);
      });
      await batch.commit();

      // Delete user authentication
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // Clean up and redirect
      localStorage.removeItem('user');
      navigate('/');
      alert('Your account and all data have been permanently deleted.');
    } catch (error) {
      console.error('Error deleting account:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        alert('For security, please sign in again to confirm account deletion.');
        await signOut(auth);
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(`Error deleting account: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Profile Info */}
        <div className="col-span-1">
          <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex flex-col items-center">
              <img
                src={user?.picture || '/default-user.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 border-2 border-blue-500 object-cover"
              />
              <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">About Me</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Passionate traveler and adventure seeker! I love discovering hidden gems and sharing my experiences.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  signOut(auth);
                  localStorage.removeItem('user');
                  navigate('/');
                }}
                className="w-full px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Sign Out
              </button>
              <button
                onClick={deleteAccount}
                className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete Account Permanently
              </button>
            </div>
          </div>
        </div>

        {/* Trips Section */}
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Saved Trips</h1>

          {myTrips.length === 0 ? (
            <p className="text-gray-600">No trips saved yet.</p>
          ) : (
            <div className="grid gap-6">
              {myTrips.map((trip, idx) => (
                <div
                  key={idx}
                  className="p-5 border rounded-lg shadow hover:shadow-md flex flex-col gap-4"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/view-trip/${trip.id}`)}
                  >
                    <h2 className="text-lg font-semibold text-gray-700">
                      Trip to {trip?.userSelection?.location?.label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Duration: {trip?.userSelection?.noOfDays} days | Budget: {trip?.userSelection?.budget}
                    </p>
                  </div>

                  {trip?.tripEnded ? (
                    <span className="inline-block bg-gray-400 text-white text-xs px-4 py-2 rounded-full w-fit">
                      Trip Ended
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate(`/trip-progress/${trip.id}`)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition w-fit"
                    >
                      Start Trip
                    </button>
                  )}

                  {trip?.tripEnded && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-2">
                      <h3 className="text-md font-bold text-gray-800 mb-2">Visited Places:</h3>
                      {getVisitedPlaceNames(trip).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                          {getVisitedPlaceNames(trip).map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">No places marked visited.</p>
                      )}

                      <h3 className="text-md font-bold text-gray-800 mt-4 mb-2">Trip Memories:</h3>
                      {trip.photos?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {trip.photos.map((photo, i) => (
                            <img
                              key={i}
                              src={photo}
                              alt="Trip memory"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No photos uploaded.</p>
                      )}

                      <div className="flex justify-start mt-6 gap-4 flex-wrap">
                        <button
                          onClick={() => navigate(`/trip-progress/${trip.id}?highlightOnly=true`)}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          ✨ Post to Highlights
                        </button>
                        <button
                          onClick={() => generateCertificate(trip)}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          � Download Certificate
                        </button>
                        <div className="flex items-center gap-2 pt-2">
                          <WhatsappShareButton
                            url={`${window.location.origin}/view-trip/${trip.id}`}
                            title={`Check out my trip to ${trip?.userSelection?.location?.label} on Ziyarah!`}
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
                          <TwitterShareButton
                            url={`${window.location.origin}/view-trip/${trip.id}`}
                            title={`Just finished an amazing trip to ${trip?.userSelection?.location?.label} with Ziyarah! 🌍✨`}
                          >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                          <LinkedinShareButton
                            url={`${window.location.origin}/view-trip/${trip.id}`}
                            title={`Travel Highlight - ${trip?.userSelection?.location?.label}`}
                            summary="My AI-powered travel journey with Ziyarah"
                            source="Ziyarah Travel Planner"
                          >
                            <LinkedinIcon size={32} round />
                          </LinkedinShareButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;