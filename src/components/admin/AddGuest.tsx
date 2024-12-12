import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createGuest } from '../../lib/firebaseServices';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

export default function AddGuest() {
  const [form, setForm] = useState({
    name: '',
    seatNumber: '',
    photo: null,
    status: 'pending' as 'pending' | 'checked-in' | 'cancelled'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({form})
      if (form.photo) {
        const photoRef = ref(storage, `guests/${form.name}-${Date.now()}`);
        await uploadBytes(photoRef, form.photo);
        const photoUrl = await getDownloadURL(photoRef);
        await createGuest({ ...form, photoUrl });
      } else {
        await createGuest(form);
      }
      setForm({ name: '', seatNumber: '', photo: null, status: 'pending' });
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
          <label className="block text-sm font-medium text-gray-300">Photo</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, photo: e.target.files ? e.target.files[0] : null })}
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