import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBKxJhsbNfxDC_q6WbGV0mXess0m8HrD_M",
  authDomain: "my-apps-410e7.firebaseapp.com",
  projectId: "my-apps-410e7",
  storageBucket: "my-apps-410e7.firebasestorage.app",
  messagingSenderId: "851917476667",
  appId: "1:851917476667:web:8e8cfb6ed83e2a7ed3dd1e",
  measurementId: "G-MNZP2EYSVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };