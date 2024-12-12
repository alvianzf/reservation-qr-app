import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { createGuest, fetchGuests } from '../../lib/firebaseServices';

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
      await createGuest({ ...form, photo: form.photo });
      setForm({ name: '', seatNumber: '', photo: null, status: 'pending' });
      toast.success('Guest added successfully');
      fetchGuests().then(guests => {
        console.log(guests);
      });
    } catch (error) {
      toast.error('Failed to add guest');
      console.error(error)
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg box-border">
      <div className="flex items-center space-x-2 mb-4 box-border">
        <UserPlus className="h-6 w-6 text-indigo-400" />
        <h3 className="text-xl font-semibold text-white">Add New Guest</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 box-border">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white box-border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Seat Number</label>
          <input
            type="text"
            value={form.seatNumber}
            onChange={(e) => setForm({ ...form, seatNumber: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white box-border"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Photo</label>
          <div className="mt-1 flex items-center space-x-2 box-border">
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setForm({ ...form, photo: file });
              }}
              className="hidden"
              id="photoInput"
            />
            <label htmlFor="photoInput" className="bg-gray-500 text-xs text-white rounded-md py-2 px-4 hover:bg-gray-600 transition box-border">
              Upload Photo
            </label>
            {form.photo && (
              <div className="flex space-x-2 box-border">
                <img
                  src={URL.createObjectURL(form.photo as File)}
                  alt="Uploaded Photo"
                  className="w-24 h-24 rounded-full object-cover box-border"
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition flex items-center justify-center box-border"
        >
          <i className="fa fa-plus-circle mr-2"></i>
          Add Guest
        </button>
      </form>
    </div>
  );
}