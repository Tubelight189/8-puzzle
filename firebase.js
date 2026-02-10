// firebaseConfig.js
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import specific auth functions you'll use
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Import specific firestore functions you'll use
import { doc, setDoc } from "firebase/firestore";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN_API_KEY,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID_API_KEY,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET_API_KEY,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID_API_KEY,
  appId: process.env.EXPO_PUBLIC_APP_ID_API_KEY,
  measurementId: process.env.EXPO_PUBLIC_MEASURENENT_ID_API_KEY,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Export everything needed
export {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  signInWithEmailAndPassword,
  storage
};

