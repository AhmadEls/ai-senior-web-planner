import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from './components/ui/sonner';

// Pages
import Createtrip from './create-trip';
import Viewtrip from './view-trip/[tripId]';
import MyTrips from './my-trips';
import About from './pages/About';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import TripProgress from './pages/TripProgress';
import Highlights from './pages/Highlights';
import HighlightDetail from './pages/HighlightDetail';

// Admin
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';

import Layout from './components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/create-trip', element: <Createtrip /> },
      { path: '/view-trip/:tripId', element: <Viewtrip /> },
      { path: '/my-trips', element: <MyTrips /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/feedback', element: <Feedback /> },
      { path: '/profile', element: <Profile /> },
      { path: '/trip-progress/:tripId', element: <TripProgress /> },
      { path: '/highlights', element: <Highlights /> },
      { path: '/highlight-details/:highlightId', element: <HighlightDetail /> },

      // ✅ ADMIN ROUTE
      { path: '/admin', element: <AdminRoute><AdminDashboard /></AdminRoute> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Toaster />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
