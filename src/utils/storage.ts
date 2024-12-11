import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadGuestPhoto = async (file: File, guestId: string): Promise<string> => {
  const storageRef = ref(storage, `guest-photos/${guestId}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}; 