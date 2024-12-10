import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GuestList from './GuestList';
import AddGuest from './AddGuest';

export default function AdminPanel() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/login" />;
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