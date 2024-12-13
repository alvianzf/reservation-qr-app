import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Edit, Trash2, Check, X, Download, MoreVertical } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { fetchGuests, updateGuest, deleteGuest } from "../../lib/firebaseServices";
import { Guest } from "../../types/guest";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function GuestList() {
  const [guests, setGuests] = useState<(Guest & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

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
    setDropdownOpen(null); // Close the dropdown after editing
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingId) return;
    const success = await updateGuest(editingId, editForm);
    if (success) {
      setEditingId(null);
      loadGuests();
    }
  }, [editingId, editForm, loadGuests]);

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = useCallback(
    async (id: string, photoUrl: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const success = await deleteGuest(id, photoUrl);
        if (success) {
          toast.success("Guest deleted successfully");
          loadGuests();
        }
      }
    },
    [loadGuests]
  );

  const handleStatusChange = (status: string) => {
    setEditForm({ ...editForm, status });
  };

  const downloadQRCode = (guest: Guest & { id: string }) => {
    const canvas = document.getElementById(
      `qr-code-${guest.id}`
    ) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${guest.name}_QRCode.png`;
      link.click();
    }
  };

  const guestTableRows = useMemo(() => {
    return guests.map((guest) => (
      <tr key={guest.id} className="text-xs">
        <td className="px-3 py-2 min-w-[120px]">
          {editingId === guest.id ? (
            <div className="flex items-center space-x-2">
              {/* Save and Cancel icons placed on the left */}
              <Check
                onClick={handleSave}
                className="cursor-pointer text-green-600 h-5 w-5"
              />
              <X
                onClick={handleCancel}
                className="cursor-pointer text-red-600 h-5 w-5"
              />
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="bg-gray-200 text-black rounded px-1 py-0.5 w-full"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <img
                src={guest.photo}
                alt={guest.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-black truncate">{guest.name}</span>
            </div>
          )}
        </td>
        <td className="px-3 py-2 max-w-[70px]">
          {editingId === guest.id ? (
            <input
              type="text"
              value={editForm.seatNumber || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, seatNumber: e.target.value })
              }
              className="bg-gray-200 text-black rounded px-1 py-0.5"
            />
          ) : (
            <span className="text-black">{guest.seatNumber}</span>
          )}
        </td>
        <td className="px-3 py-2">
          {editingId === guest.id ? (
            <select
              value={editForm.status || guest.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-gray-200 text-black rounded px-1 py-0.5"
            >
              <option value="checked-in">Checked-In</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          ) : (
            <span
              className={`px-1 py-0.5 rounded-full text-xxs ${
                guest.status === "checked-in"
                  ? "bg-green-900 text-green-200"
                  : guest.status === "cancelled"
                  ? "bg-red-900 text-red-200"
                  : "bg-yellow-900 text-yellow-200"
              }`}
              style={{ fontSize: "0.5rem" }} // 1em smaller
            >
              {guest.status}
            </span>
          )}
        </td>
        <td className="px-3 py-2">
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === guest.id ? null : guest.id)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {dropdownOpen === guest.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleEdit(guest);
                      setDropdownOpen(null); // Hide the dropdown after edit
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(guest.id, guest.photo);
                      setDropdownOpen(null); // Hide the dropdown after delete
                    }}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      downloadQRCode(guest);
                      setDropdownOpen(null); // Hide the dropdown after QR download
                    }}
                    className="block px-4 py-2 text-sm text-teal-600 hover:bg-teal-100"
                  >
                    Download QR
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-2">
          <QRCodeCanvas
            id={`qr-code-${guest.id}`}
            value={guest.id}
            size={112} // Slightly smaller QR code size
            style={{ display: "none" }}
          />
        </td>
      </tr>
    ));
  }, [guests, editingId, editForm, dropdownOpen, handleEdit, handleDelete]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        Loading guests...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Guest List</h2>
      {guests.length === 0 ? (
        <div className="text-center py-8 text-black-400">No guests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-silver rounded-lg">
            <thead className="bg-gray-100 rounded-t-lg">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Seat
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-black-300 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody>{guestTableRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
