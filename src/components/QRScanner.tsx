import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { checkInGuest, fetchGuests } from '../lib/firebaseServices/guestServices';
import { Guest } from '../types/guest';
import toast from 'react-hot-toast';

export default function QRScanner() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    const startScanner = async () => {
      try {
        if (scanner) {
          await scanner.stop();
          setScanner(null);
        }

        const readerElement = document.getElementById('reader');
        if (!readerElement) {
          console.error('Reader element not found');
          return;
        }

        html5QrCode = new Html5Qrcode("reader");
        setScanner(html5QrCode);

        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          try {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const cameraId = isMobile ? devices[devices.length - 1].id : devices[0].id;

            await html5QrCode.start(
              { deviceId: cameraId },
              {
                fps: 10,
                qrbox: { width: 250, height: 250 }
              },
              async (decodedText) => {
                try {
                  const guests = await fetchGuests();
                  const guestData = guests.find(guest => guest.id === decodedText);
                  
                  if (guestData) {
                    setGuest(guestData);
                    await checkInGuest(guestData.id, { checkInTime: new Date(), status: 'checked-in' });
                    toast.success('Guest checked in successfully!');
                    if (html5QrCode?.isScanning) {
                      await html5QrCode.stop();
                    }
                  } else {
                    toast.error('Guest not found');
                  }
                } catch (err) {
                  console.error('Error scanning QR code:', err);
                  toast.error('Error scanning QR code');
                }
              },
              (errorMessage) => {
                if (!errorMessage.includes('NotFoundException')) {
                  console.error('QR Scan error:', errorMessage);
                }
              }
            );
          } catch (err) {
            console.error('Error starting scanner:', err);
            toast.error('Error starting scanner');
          }
        } else {
          toast.error('No cameras found');
        }
      } catch (err) {
        console.error('Camera access error:', err);
        toast.error('Unable to start camera');
      }
    };

    startScanner();

    return () => {
      if (scanner?.isScanning) {
        scanner.stop().catch((err) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []); // Keep empty dependency array

  return (
    <div className="max-w-md mx-auto">
      {!guest ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black text-center">Scan Guest QR Code</h2>
          <div 
            id="reader" 
            className="bg-babyBlue p-4 rounded-lg border"
          ></div>
          <p className="text-black-400 text-center text-sm">
            Position the QR code within the frame to scan
          </p>
        </div>
      ) : (
        <div className="bg-silver rounded-lg border p-6 space-y-4">
          <img 
            src={guest.photo} 
            alt={guest.name} 
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-indigo-500"
          />
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-black">{guest.name}</h3>
            <p className="text-indigo-400 font-medium">Seat: {guest.seatNumber}</p>
            <p className="text-green-400">✓ Checked In</p>
          </div>
        </div>
      )}
    </div>
  );
}