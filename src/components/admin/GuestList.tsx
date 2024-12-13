import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Edit, Trash2, Check, X, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { fetchGuests, updateGuest, deleteGuest } from '../../lib/firebaseServices';
import { Guest } from '../../types/guest';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function GuestList() {
  const [guests, setGuests] = useState<(Guest & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});

  const loadGuests = useCallback(async () => {
    setLoading(true);
    const guestList = await fetchGuests();
    setGuests(guestList);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const handleEdit = useCallback((guest: Guest & { id: string }) => {
    setEditingId(guest.id);
    setEditForm(guest);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingId) return;
    const success = await updateGuest(editingId, editForm);
    if (success) {
      setEditingId(null);
      loadGuests();
    }
  }, [editingId, editForm, loadGuests]);

  const handleDelete = useCallback(async (id: string, photoUrl: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const success = await deleteGuest(id, photoUrl);
      if (success) {
        toast.success('Guest deleted successfully');
        loadGuests();
      }
    }
  }, [loadGuests]);

  const downloadQRCode = (guest: Guest & { id: string}) => {
    const canvas = document.getElementById(`qr-code-${guest.id}`) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${guest.name}_QRCode.png`;
      link.click();
    }
  };

  const guestTableRows = useMemo(() => {
    return guests.map((guest) => (
      <tr key={guest.id}>
        <td className="px-6 py-4">
          {editingId === guest.id ? (
            <input
              type="text"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="bg-gray-200 text-black rounded px-2 py-1 w-100"
            />
          ) : (
            <div className="flex items-center">
              <img
                src={guest.photo}
                alt={guest.name}
                className="h-8 w-8 rounded-full mr-3"
              />
              <span className="text-black">{guest.name}</span>
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          {editingId === guest.id ? (
            <input
              type="text"
              value={editForm.seatNumber || ''}
              onChange={(e) => setEditForm({ ...editForm, seatNumber: e.target.value })}
              className="bg-gray-200 text-black rounded px-2 py-1"
            />
          ) : (
            <span className="text-black">{guest.seatNumber}</span>
          )}
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-2 py-1 rounded-full text-xxs ${
              guest.status === 'checked-in'
                ? 'bg-green-900 text-green-200'
                : guest.status === 'cancelled'
                ? 'bg-red-900 text-red-200'
                : 'bg-yellow-900 text-yellow-200'
            }`}
          >
            {guest.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            {editingId === guest.id ? (
              <>
                <button onClick={handleSave} className="text-green-400 hover:text-green-300">
                  <Check className="h-5 w-5" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300">
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleEdit(guest)} className="text-blue-400 hover:text-blue-300">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(guest.id, guest.photo)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button onClick={() => downloadQRCode(guest)} className="text-teal-400 hover:text-teal-300">
                  <Download className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </td>
        <td>
          <QRCodeCanvas
            id={`qr-code-${guest.id}`}
            value={guest.id}
            size={128}
            style={{ display: 'none' }}
          />
        </td>
      </tr>
    ));
  }, [guests, editingId, editForm, handleEdit, handleDelete, handleSave]);

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading guests...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-black">Guest List</h2>
      {guests.length === 0 ? (
        <div className="text-center py-8 text-black-400">No guests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-silver rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">{guestTableRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
