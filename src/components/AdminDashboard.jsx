// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminDashboard = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'TripHighlights'));
    setHighlights(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const deleteHighlight = async (id) => {
    if (window.confirm("Are you sure you want to delete this highlight?")) {
      await deleteDoc(doc(db, 'TripHighlights', id));
      fetchHighlights();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      {loading ? (
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
      )}
    </div>
  );
};

export default AdminDashboard;
