import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANZJMUbvPjCFt68iO3HlqAtqgqbxqA5Gk",
  authDomain: "bankqueue-webapp.firebaseapp.com",
  projectId: "bankqueue-webapp",
  storageBucket: "bankqueue-webapp.firebasestorage.app",
  messagingSenderId: "303229630464",
  appId: "1:303229630464:web:9cd88e065809d6df1180e5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);