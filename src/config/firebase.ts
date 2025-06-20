
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPP_FXE8tLAeakhhsft0maiEo9dKquj_M",
  authDomain: "todo-app-19ebf.firebaseapp.com",
  projectId: "todo-app-19ebf",
  storageBucket: "todo-app-19ebf.firebasestorage.app",
  messagingSenderId: "946027183999",
  appId: "1:946027183999:web:80ba4b4ee3c0a6e7c8e44a",
  measurementId: "G-K87NBL9Q3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
