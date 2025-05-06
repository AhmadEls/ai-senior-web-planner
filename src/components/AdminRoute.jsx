// src/components/AdminRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        setIsAdmin(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, 'admins', user.email.toLowerCase()));
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) return null; // or a spinner/loading
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
