import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import QRScanner from './components/QRScanner';
import GuestQR from './components/GuestQR';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './components/auth/LoginPage';
import AdminPanel from './components/admin/AdminPanel';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/scanner" element={<QRScanner />} />
              <Route path="/guest/:guestId" element={<GuestQR />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#374151',
                color: '#fff',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;