import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  import toast from 'react-hot-toast';
  
  let lastRequestTime = 0;

  export const signIn = async (email: string, password: string) => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastRequestTime < 1000) {
        return null;
      }
      lastRequestTime = currentTime;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
      return null;
    }
  };
  
  export const signUp = async (email: string, password: string, additionalData?: any) => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastRequestTime < 1000) {
        return null;
      }
      lastRequestTime = currentTime;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Optional: Store additional user data in Firestore
      if (additionalData) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          ...additionalData
        });
      }
  
      toast.success('Account created successfully');
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      return null;
    }
  };
  
  export const logout = async () => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastRequestTime < 1000) {
        return false;
      }
      lastRequestTime = currentTime;
      await signOut(auth);
      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      return false;
    }
  };
  
  export const resetPassword = async (email: string) => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastRequestTime < 1000) {
        return false;
      }
      lastRequestTime = currentTime;
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
      return false;
    }
  };

  export const signInWithGoogle = async () => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastRequestTime < 1000) {
        return null;
      }
      lastRequestTime = currentTime;
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      toast.success('Logged in successfully with Google');
      return userCredential.user;
    } catch (error) {
      console.error('Google signin error:', error);
      toast.error('Failed to log in with Google');
      return null;
    }
  };

  export const checkIfUserAuthenticated = async () => {
    try {
      const user = await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        }, reject);
      });
      return user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      toast.error('Failed to check authentication status');
      return false;
    }
  };