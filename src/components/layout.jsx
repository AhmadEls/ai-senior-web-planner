// src/components/Layout.jsx
import React from 'react';
import Header from './custom/Header';
import Footer from '../view-trip/components/Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
