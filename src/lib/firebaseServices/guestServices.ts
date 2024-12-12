import { Guest } from '../../types/guest';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_PROJECT_ID}/databases/(default)/documents`;

let lastRequestTime = 0;
export const fetchGuests = async () => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < 1000) {
      return [];
    }
    lastRequestTime = currentTime;
    const response = await axios.get(`${API_URL}/guests`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.documents.length === 0) {
      return [];
    }
    return response.data.documents.map((doc) => ({ id: doc.name.split('/').pop(), ...doc.fields })) as (Guest & { id: string })[];
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
    const response = await axios.post(`${API_URL}/guests`, {
      fields: guestData,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Guest added successfully');
    return response.data.name.split('/').pop();
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
    const response = await axios.patch(`${API_URL}/guests/${id}`, {
      fields: guestData,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
    await axios.delete(`${API_URL}/guests/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Guest deleted successfully');
    return true;
  } catch (error) {
    toast.error('Failed to delete guest');
    console.error(error);
    return false;
  }
};

export const subscribeToGuests = () => {
  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get(`${API_URL}/guests`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.documents.length === 0) {
        console.log([]);
        return;
      }
      const guests = response.data.documents.map((doc) => ({ id: doc.name.split('/').pop(), ...doc.fields })) as (Guest & { id: string })[];
      console.log(guests);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Failed to load guest list');
    }
  }, 1000);
  return () => clearInterval(intervalId);
};

export const checkFirestoreConnection = async () => {
  try {
    await axios.get(`${API_URL}/guests`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Firestore connection is successful');
    return true;
  } catch (error) {
    console.error('Error checking Firestore connection:', error);
    toast.error('Failed to connect to Firestore');
    return false;
  }
};