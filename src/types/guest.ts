export interface Guest {
  name: string;
  seatNumber: string;
  photoUrl?: string;
  checkInTime?: Date;
  status: 'pending' | 'checked-in' | 'cancelled';
}

export interface GuestWithId extends Guest {
  id: string;
}