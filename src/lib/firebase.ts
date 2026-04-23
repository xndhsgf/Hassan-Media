import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATnqH3GRdot5Oy18MFE5YhfeHVoUVIRHw",
  authDomain: "adobe-614e1.firebaseapp.com",
  projectId: "adobe-614e1",
  storageBucket: "adobe-614e1.firebasestorage.app",
  messagingSenderId: "119760733080",
  appId: "1:119760733080:web:30b91b0331b67ad4d921ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
