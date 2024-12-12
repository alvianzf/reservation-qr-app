import { Guest } from '../../types/guest';
import toast from 'react-hot-toast';
import axios from 'axios';
import { firestore, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const API_URL = `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_PROJECT_ID}/databases/(default)/documents`;

export const fetchGuests = async () => {
    try {
        const response = await axios.get(`${API_URL}/guests`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.data || !response.data.documents || response.data.documents.length === 0) {
            return [];
        }
        return response.data.documents.map((doc: { name: string; fields: any }) => {
            const id = doc.name.split('/').pop();
            const { name, photo, seatNumber, status, ...rest } = doc.fields;
            return { id, ...rest, name: name.stringValue, photo: photo.stringValue, seatNumber: seatNumber.stringValue, status: status.stringValue };
        }) as (Guest & { id: string })[];
    } catch (error) {
        console.error('Error fetching guests:', error);
        toast.error('Failed to load guest list');
        return [];
    }
};

export const createGuest = async (guestData: Guest & { photo: File | null }) => {
    try {
        let photoUrl = '';

        if (guestData.photo) {
            const photoRef = ref(storage, `guests/${guestData.photo.name}`);
            
            const snapshot = await uploadBytes(photoRef, guestData.photo);

            photoUrl = await getDownloadURL(snapshot.ref);
        }

        // Add guest data to Firestore
        const docRef = await addDoc(collection(firestore, 'guests'), {
            name: guestData.name || '',
            seatNumber: guestData.seatNumber || '',
            photo: photoUrl || '',
            status: guestData.status || '',
        });

        toast.success('Guest added successfully');
        return docRef.id;
    } catch (error) {
        console.error('Error creating guest:', error);
        toast.error('Failed to create guest');
        return null;
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


export const updateGuest = async (id: string, guestData: Partial<Guest>) => {
    try {
        await axios.patch(`${API_URL}/guests/${id}`, {
            fields: {
                name: { stringValue: guestData.name },
                seatNumber: { stringValue: guestData.seatNumber },
                photo: { stringValue: guestData.photoUrl },
                status: { stringValue: guestData.status }
            },
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
            if (!response.data || !response.data.documents || response.data.documents.length === 0) {
                console.log([]);
                return;
            }
            const guests = response.data.documents.map((doc: { name: string; fields: any }) => {
                const { name, fields, ...rest } = doc;
                const { stringValue, ...restFields } = fields;
                return { id: name.split('/').pop(), ...rest, fields: restFields };
            }) as (Guest & { id: string })[];
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