# Event Check-in System

A mobile-friendly React application for managing event check-ins using QR codes. The system allows event staff to scan guest QR codes and verify their reservation details instantly.

## Features

- 📱 Mobile-optimized interface
- 🔍 Real-time QR code scanning
- 📊 Instant guest information display
- 🔐 Firebase integration for secure data storage
- 🎫 Dynamic QR code generation for guests

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-checkin-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase configuration from Project Settings
   - Update `src/lib/firebase.ts` with your configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

4. Start the development server:
```bash
npm run dev
```

## Firebase Schema

### Collection: `guests`

Document structure:
```typescript
interface Guest {
  name: string;        // Guest's full name
  seatNumber: string;  // Assigned seat number
  photoUrl: string;    // URL to guest's photo
  eventId: string;     // Reference to specific event
  checkInTime?: Date;  // Optional: Timestamp of check-in
  status: 'pending' | 'checked-in' | 'cancelled';
}
```

Example document:
```javascript
{
  "id": "guest123",  // Document ID (used for QR code)
  "name": "John Doe",
  "seatNumber": "A12",
  "photoUrl": "https://example.com/photos/john.jpg",
  "eventId": "event456",
  "status": "pending"
}
```

## Routes

| Route | Description | Parameters |
|-------|-------------|------------|
| `/scanner` | QR code scanner interface for staff | None |
| `/guest/:guestId` | Guest QR code display | `guestId`: Guest document ID |

## API Documentation

### QR Scanner Component

Location: `src/components/QRScanner.tsx`

Purpose: Handles QR code scanning and guest verification

Usage:
```tsx
<QRScanner />
```

### Guest QR Component

Location: `src/components/GuestQR.tsx`

Purpose: Displays guest's QR code for scanning

Usage:
```tsx
<GuestQR />
```

URL Parameters:
- `guestId` (required): The unique identifier for the guest

## Security Considerations

1. Firebase Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guests/{guestId} {
      allow read: if true;  // Public read access for QR verification
      allow write: if request.auth != null;  // Only authenticated staff can modify
    }
  }
}
```

2. Recommended Additional Security Measures:
   - Implement rate limiting for QR code scanning
   - Add staff authentication for scanner access
   - Enable Firebase App Check
   - Implement session management for staff access

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── QRScanner.tsx   # QR code scanning component
│   └── GuestQR.tsx     # Guest QR code display
├── lib/
│   └── firebase.ts     # Firebase configuration
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Browser Compatibility

- Requires a modern browser with camera access
- Tested on latest versions of:
  - Chrome (Android & Desktop)
  - Safari (iOS & Desktop)
  - Firefox (Desktop)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details