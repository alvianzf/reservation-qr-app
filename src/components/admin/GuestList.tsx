import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Guest } from '../../types/guest';
import { Edit, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GuestList() {
  const [guests, setGuests] = useState<(Guest & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});

  useEffect(() => {
    const q = query(collection(db, 'guests'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setGuests([]);
        setLoading(false);
        return;
      }
      const guestList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as (Guest & { id: string })[];
      setGuests(guestList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching guests:', error);
      toast.error('Failed to load guest list');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (guest: Guest & { id: string }) => {
    setEditingId(guest.id);
    setEditForm(guest);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'guests', editingId), editForm);
      toast.success('Guest updated successfully');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update guest');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    try {
      await deleteDoc(doc(db, 'guests', id));
      toast.success('Guest deleted successfully');
    } catch (error) {
      toast.error('Failed to delete guest');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-white">Loading guests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Guest List</h2>
      {guests.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No guests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {guests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === guest.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-gray-700 text-white rounded px-2 py-1"
                      />
                    ) : (
                      <div className="flex items-center">
                        <img
                          src={guest.photoUrl}
                          alt={guest.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <span className="text-white">{guest.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === guest.id ? (
                      <input
                        type="text"
                        value={editForm.seatNumber || ''}
                        onChange={(e) => setEditForm({ ...editForm, seatNumber: e.target.value })}
                        className="bg-gray-700 text-white rounded px-2 py-1"
                      />
                    ) : (
                      <span className="text-white">{guest.seatNumber}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      guest.status === 'checked-in' ? 'bg-green-900 text-green-200' :
                      guest.status === 'cancelled' ? 'bg-red-900 text-red-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {editingId === guest.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(guest)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}