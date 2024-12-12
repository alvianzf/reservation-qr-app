import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createGuest } from '../../lib/firebaseServices';

export default function AddGuest() {
  const [form, setForm] = useState({
    name: '',
    seatNumber: '',
    photoUrl: '',
    eventId: '',
    status: 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({form})
      await createGuest(form);
      setForm({ name: '', seatNumber: '', photoUrl: '', eventId: '', status: '' });
      toast.success('Guest added successfully');
    } catch (error) {
      toast.error('Failed to add guest');
      console.error(error)
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="h-6 w-6 text-indigo-400" />
        <h3 className="text-xl font-semibold text-white">Add New Guest</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Seat Number</label>
          <input
            type="text"
            value={form.seatNumber}
            onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Photo URL</label>
          <input
            type="url"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Event ID</label>
          <input
            type="text"
            value={form.eventId}
            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white rounded-md py-2 hover:bg-indigo-600 transition"
        >
          Add Guest
        </button>
      </form>
    </div>
  );
}