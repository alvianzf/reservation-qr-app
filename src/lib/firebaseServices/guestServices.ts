import { collection, deleteDoc, doc, updateDoc, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Guest } from '../../types/guest';
import toast from 'react-hot-toast';

let lastRequestTime = 0;

export const fetchGuests = async () => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      return [];
    }
    lastRequestTime = currentTime;
    const guestCollectionRef = collection(db, 'guests');
    const snapshot = await getDocs(guestCollectionRef);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as (Guest & { id: string })[];
  } catch (error) {
    console.error('Error fetching guests:', error);
    toast.error('Failed to load guest list');
    return [];
  }
};

export const createGuest = async (guestData: Guest) => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      return null;
    }
    lastRequestTime = currentTime;
    const docRef = await addDoc(collection(db, 'guests'), guestData);
    toast.success('Guest added successfully');
    return docRef.id;
  } catch (error) {
    console.error('Error creating guest:', error);
    toast.error('Failed to create guest');
    return null;
  }
};

export const updateGuest = async (id: string, guestData: Partial<Guest>) => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      return false;
    }
    lastRequestTime = currentTime;
    await updateDoc(doc(db, 'guests', id), guestData);
    toast.success('Guest updated successfully');
    return true;
  } catch (error) {
    toast.error('Failed to update guest');
    console.error(error);
    return false;
  }
};

export const deleteGuest = async (id: string) => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      return false;
    }
    lastRequestTime = currentTime;
    await deleteDoc(doc(db, 'guests', id));
    toast.success('Guest deleted successfully');
    return true;
  } catch (error) {
    toast.error('Failed to delete guest');
    return false;
  }
}; 