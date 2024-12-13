import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { checkInGuest, fetchGuests } from '../lib/firebaseServices/guestServices';
import { Guest } from '../types/guest';
import toast from 'react-hot-toast';

export default function QRScanner() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  // Responsive QR box sizing for both mobile and PC
  const calculateQrBoxSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Different sizing logic for mobile and desktop
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      return { 
        width: Math.min(screenWidth * 0.7, 250), 
        height: Math.min(screenWidth * 0.7, 250) 
      };
    } else {
      return { 
        width: Math.min(screenWidth * 0.4, 350), 
        height: Math.min(screenWidth * 0.4, 350) 
      };
    }
  };

  // Comprehensive camera selection for cross-platform support
  const selectBestCamera = (devices: any[]) => {
    // Order of preference: back camera, front camera, first available
    const backCamera = devices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear')
    );

    const frontCamera = devices.find(device => 
      device.label.toLowerCase().includes('front') || 
      device.label.toLowerCase().includes('user')
    );

    return backCamera?.id || frontCamera?.id || devices[0]?.id;
  };

  // Camera permissions and detection
  const initializeCameras = async () => {
    try {
      // Check and request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());

      // Detect available cameras
      const devices = await Html5Qrcode.getCameras();
      setAvailableCameras(devices);

      if (devices.length > 0) {
        const bestCameraId = selectBestCamera(devices);
        setSelectedCameraId(bestCameraId);
        return true;
      } else {
        setCameraError('No cameras found');
        toast.error('No cameras available');
        return false;
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setCameraError('Camera access denied. Please grant permissions.');
      toast.error('Camera access denied');
      return false;
    }
  };

  // Start QR code scanner
  const startScanner = async (cameraId: string) => {
    try {
      // Stop existing scanner if any
      if (scanner) {
        await scanner.stop();
        setScanner(null);
      }

      const readerElement = document.getElementById('reader');
      if (!readerElement) {
        console.error('Reader element not found');
        return;
      }

      // Initialize new scanner
      const html5QrCode = new Html5Qrcode("reader");
      setScanner(html5QrCode);

      await html5QrCode.start(
        { deviceId: cameraId },
        {
          fps: 10,
          qrbox: calculateQrBoxSize()
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
      console.error('Scanner start error:', err);
      setCameraError('Unable to start scanner');
      toast.error('Error starting scanner');
    }
  };

  // Initialize on component mount
  useEffect(() => {
    const setupScanner = async () => {
      const camerasInitialized = await initializeCameras();
      if (camerasInitialized && selectedCameraId) {
        await startScanner(selectedCameraId);
      }
    };

    setupScanner();

    // Cleanup on unmount
    return () => {
      if (scanner?.isScanning) {
        scanner.stop().catch((err) => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []);

  // Camera selection dropdown for multiple cameras
  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCameraId = event.target.value;
    setSelectedCameraId(newCameraId);
    if (newCameraId) {
      startScanner(newCameraId);
    }
  };

  // Reset scanner
  const handleRetry = () => {
    setGuest(null);
    setCameraError(null);
    if (selectedCameraId) {
      startScanner(selectedCameraId);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Camera selection dropdown */}
      {availableCameras.length > 1 && (
        <div className="mb-4">
          <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700">
            Select Camera
          </label>
          <select
            id="camera-select"
            value={selectedCameraId || ''}
            onChange={handleCameraChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {availableCameras.map((camera, index) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error state */}
      {cameraError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{cameraError}</span>
          <button 
            onClick={handleRetry}
            className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Scanning state */}
      {!guest && !cameraError && (
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
      )}

      {/* Checked-in state */}
      {guest && (
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
            <button 
              onClick={handleRetry}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}