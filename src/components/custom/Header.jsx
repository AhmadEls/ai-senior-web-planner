import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    window.location.href = '/';
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        setOpenLoginDialog(false);
        window.location.reload();
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
  });

  const navItemVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm flex justify-between items-center px-6 py-3 border-b border-gray-200">
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to="/" className="flex items-center gap-2">
          <img src='/logo.svg' alt='Logo' className='h-10' />
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            <span className="text-blue-600">Ziy</span>
            <span className="text-orange-500">arah</span>
          </span>
        </Link>
      </motion.div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {[
          { path: '/', label: 'Home' },
          { path: '/about', label: 'About' },
          { path: '/contact', label: 'Contact' },
          { path: '/feedback', label: 'Feedback' },
          { path: '/highlights', label: 'Highlights' }
        ].map((item) => (
          <motion.div
            key={item.path}
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to={item.path}
              className={`px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                location.pathname === item.path
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        {/* User Menu */}
        {user ? (
          <>
            {[
              { path: '/create-trip', label: 'Create Trip' },
              { path: '/my-trips', label: 'Trip History' }
            ].map((item) => (
              <motion.div
                key={item.path}
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to={item.path}
                  className={`px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <motion.img
                  src={user?.picture}
                  alt="User profile"
                  className="h-9 w-9 rounded-full object-cover cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-44 p-2 shadow-md border border-gray-200 bg-white rounded-lg flex flex-col gap-2">
                <motion.button
                  onClick={() => window.location.href = '/profile'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="header-profile-btn"
                >
                  My Profile
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="header-profile-btn"
                >
                  Logout
                </motion.button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <motion.button
            onClick={() => setOpenLoginDialog(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="header-signin-btn"
          >
            Sign In
          </motion.button>
        )}
      </div>

      {/* Sign In Dialog */}
      <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
        <DialogContent className="max-w-md rounded-lg border-none shadow-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In Required</DialogTitle>
            <div className="flex flex-col items-center text-center p-6">
              <motion.img
                src="/logo.svg"
                className="h-12 mb-3"
                alt="App logo"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              />
              <h2 className='font-bold text-xl mb-1 text-gray-900'>Sign In With Google</h2>
              <p className="text-sm text-gray-600 mb-6">Sign in to continue planning your journey</p>
              <motion.button
                onClick={login}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="header-google-btn"
              >
                <FcGoogle className='h-5 w-5' />
                Sign In With Google
              </motion.button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
