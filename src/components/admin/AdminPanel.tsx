import React, { useEffect, useState } from 'react';
import GuestList from './GuestList';
import AddGuest from './AddGuest';
import { checkIfUserAuthenticated } from '../../lib/firebaseServices/authServices';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkIfUserAuthenticated();
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GuestList />
        </div>
        <div>
          <AddGuest />
        </div>
      </div>
    </div>
  );
}