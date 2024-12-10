import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useParams } from 'react-router-dom';
import { Guest } from '../types/guest';

export default function GuestQR() {
  const { guestId } = useParams();
  const [guestData, setGuestData] = useState<Guest | null>(null);

  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return;
      const guestRef = doc(db, 'guests', guestId);
      const guestSnap = await getDoc(guestRef);
      if (guestSnap.exists()) {
        setGuestData(guestSnap.data() as Guest);
      }
    };

    fetchGuest();
  }, [guestId]);

  if (!guestData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <h2 className="text-2xl font-semibold text-white">Your Event QR Code</h2>
      <div className="bg-white p-4 rounded-lg inline-block mx-auto">
        <QRCode value={guestId} />
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
        <img 
          src={guestData.photoUrl} 
          alt={guestData.name} 
          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-indigo-500"
        />
        <div>
          <h3 className="text-xl font-semibold text-white">{guestData.name}</h3>
          <p className="text-indigo-400">Seat: {guestData.seatNumber}</p>
        </div>
      </div>
      <p className="text-gray-400">
        Show this QR code at the event entrance for quick check-in
      </p>
    </div>
  );
}