import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Home, ScanLine, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-babyBlue w-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-indigo-400" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-black-300 hover:text-black flex items-center space-x-1"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/scanner" 
              className="text-black-300 hover:text-black flex items-center space-x-1"
            >
              <ScanLine className="h-5 w-5" />
              <span>Scanner</span>
            </Link>
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="text-black-300 hover:text-black flex items-center space-x-1"
              >
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-black-300 hover:text-black flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5" />
                {/* <span>Logout</span> */}
              </button>
            ) : (
              <Link 
                to="/login" 
                className="text-black-300 hover:text-black flex items-center space-x-1"
              >
                <Shield className="h-5 w-5" />
                {/* <span>Login</span> */}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}