// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
// eslint-disable-next-line no-unused-vars
import { db, auth } from '../firebaseConfig';
// eslint-disable-next-line no-unused-vars
import { deleteUser } from 'firebase/auth';

const AdminDashboard = () => {
  const [highlights, setHighlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('highlights');
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'highlights') {
      fetchHighlights();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchHighlights = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'TripHighlights'));
    setHighlights(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      // Get all users from AITrips collection (since we don't have a dedicated users collection)
      const tripsSnapshot = await getDocs(collection(db, 'AITrips'));
      
      // Create a map of unique users with their data
      const usersMap = new Map();
      tripsSnapshot.forEach(doc => {
        const trip = doc.data();
        if (trip.userEmail && !usersMap.has(trip.userEmail)) {
          usersMap.set(trip.userEmail, {
            email: trip.userEmail,
            name: trip.userName || 'Unknown',
            picture: trip.userPhoto || 'https://via.placeholder.com/40',
            tripCount: 1
          });
        } else if (trip.userEmail) {
          const user = usersMap.get(trip.userEmail);
          user.tripCount += 1;
        }
      });
      
      setUsers(Array.from(usersMap.values()));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setUserLoading(false);
  };

  const deleteHighlight = async (id) => {
    if (window.confirm("Are you sure you want to delete this highlight?")) {
      await deleteDoc(doc(db, 'TripHighlights', id));
      fetchHighlights();
    }
  };

  const deleteUserAccount = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email} and all their data?`)) {
      return;
    }

    try {
      // 1. Delete all user trips
      const tripsQuery = query(collection(db, 'AITrips'), where('userEmail', '==', email));
      const tripsSnapshot = await getDocs(tripsQuery);
      const deletePromises = tripsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // 2. Delete user highlights
      const highlightsQuery = query(collection(db, 'TripHighlights'), where('userEmail', '==', email));
      const highlightsSnapshot = await getDocs(highlightsQuery);
      const highlightDeletePromises = highlightsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(highlightDeletePromises);

      // Note: Actual user auth record deletion would require Firebase Admin SDK on backend
      alert(`All data for ${email} has been deleted. Note: Auth record remains for security reasons.`);
      
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'highlights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('highlights')}
        >
          Trip Highlights
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>

      {activeTab === 'highlights' ? (
        loading ? (
          <div className="text-center text-gray-500">Loading highlights...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">User</th>
                <th className="border p-2">Trip Name</th>
                <th className="border p-2">Visited Places</th>
                <th className="border p-2">Comment</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {highlights.map((highlight) => (
                <tr key={highlight.id} className="hover:bg-gray-50 border-t">
                  <td className="border p-2 flex items-center space-x-3">
                    <img
                      src={highlight.userPhoto || "https://via.placeholder.com/40"}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{highlight.userName || "Anonymous"}</span>
                  </td>
                  <td className="border p-2">{highlight.tripName || "No Trip Name"}</td>
                  <td className="border p-2">
                    <ul className="list-disc ml-4">
                      {(highlight.visitedPlaces || []).slice(0, 3).map((place, idx) => (
                        <li key={idx}>{place}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border p-2">
                    {highlight.comment ? highlight.comment.slice(0, 50) + '...' : "No Comment"}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteHighlight(highlight.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        userLoading ? (
          <div className="text-center text-gray-500">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">User</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Trips</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50 border-t">
                  <td className="border p-2 flex items-center space-x-3">
                    <img
                      src={user.picture}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.tripCount}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteUserAccount(user.email)}
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default AdminDashboard;