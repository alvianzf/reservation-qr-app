# Event Check-in System

A mobile-friendly React application for managing event check-ins using QR codes. The system allows event staff to scan guest QR codes and verify their reservation details instantly.

## Features

- 📱 Mobile-optimized interface
- 🔍 Real-time QR code scanning
- 📊 Instant guest information display
- 🔐 Firebase Authentication and Firestore integration
- 🎫 Dynamic QR code generation for guests
- 👥 Admin panel for guest management

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

3. Create a `.env` file in the root directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password provider
   - Enable Firestore Database
   - Set up the security rules as shown in the Security Rules section

5. Start the development server:
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

| Route | Description | Access Level | Features |
|-------|-------------|--------------|----------|
| `/` | Home page | Public | Welcome screen, login option |
| `/scanner` | QR code scanner | Staff only | Camera access, real-time scanning |
| `/admin/guests` | Guest management | Admin only | List, edit, delete guests |
| `/admin/add-guest` | Add new guest | Admin only | Guest creation form |
| `/guest/:guestId` | Guest QR code | Guest only | QR code display |

## Components

### QR Scanner Component

Location: `src/components/QRScanner.tsx`

Purpose: Handles QR code scanning and guest verification. Protected by authentication.

Features:
- Real-time camera feed
- QR code detection
- Instant guest verification
- Check-in status updates

### Guest List Component

Location: `src/components/admin/GuestList.tsx`

Features:
- Guest data table
- Sort and filter options
- Bulk actions
- Real-time updates

### Add Guest Component

Location: `src/components/admin/AddGuest.tsx`

Features:
- Guest information form
- Input validation
- Automatic QR code generation
- Success notifications

## Authentication

The application uses Firebase Authentication with the following features:

- Email/Password authentication for staff and admin users
- Protected routes using `useAuth` hook
- Authentication context provider for global auth state
- Role-based access control (Admin/Staff)

## Security Rules

### Firestore Security Rules

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

## Project Structure

```
src/
├── components/
│   ├── QRScanner.tsx      # QR code scanning interface
│   ├── HomePage.tsx       # Landing page component
│   ├── Navbar.tsx         # Navigation component
│   └── admin/
│       ├── GuestList.tsx  # Guest management interface
│       └── AddGuest.tsx   # Guest creation form
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── lib/
│   └── firebase.ts        # Firebase configuration
└── App.tsx                # Main application component
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile browsers:
- Chrome for Android
- Safari for iOS

Note: Camera access required for QR scanning functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
