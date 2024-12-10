export interface Guest {
  name: string;
  seatNumber: string;
  photoUrl: string;
  eventId: string;
  checkInTime?: Date;
  status: 'pending' | 'checked-in' | 'cancelled';
}