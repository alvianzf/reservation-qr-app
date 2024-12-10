import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Guest } from '../types/guest';

export default function QRScanner() {
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false); // Added required third boolean parameter

    const handleScanSuccess = async (decodedText: string) => {
      try {
        const guestRef = doc(db, 'guests', decodedText);
        const guestSnap = await getDoc(guestRef);
        
        if (!guestSnap.exists()) {
          toast.error('Guest not found');
          return;
        }

        const guestData = guestSnap.data() as Guest;
        setGuest(guestData);
        
        await updateDoc(guestRef, {
          checkInTime: new Date(),
          status: 'checked-in'
        });
        
        toast.success('Guest checked in successfully!');
        scanner.clear();
      } catch (error) {
        toast.error('Error scanning QR code');
        console.error(error);
      }
    };

    const handleScanError = (error: any) => {
      console.error('QR Scan Error:', error);
    };

    scanner.render(handleScanSuccess, handleScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  const GuestDisplay = ({ guest }: { guest: Guest }) => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
      <img 
        src={guest.photoUrl} 
        alt={guest.name} 
        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-indigo-500"
      />
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-white">{guest.name}</h3>
        <p className="text-indigo-400 font-medium">Seat: {guest.seatNumber}</p>
        <p className="text-green-400">✓ Checked In</p>
      </div>
    </div>
  );

  const ScannerDisplay = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center">Scan Guest QR Code</h2>
      <div 
        id="reader" 
        className="bg-gray-800 p-4 rounded-lg border border-gray-700"
      ></div>
      <p className="text-gray-400 text-center text-sm">
        Position the QR code within the frame to scan
      </p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      {guest ? <GuestDisplay guest={guest} /> : <ScannerDisplay />}
    </div>
  );
}