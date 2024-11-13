// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          // Import getAuth for authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";     // Import Storage
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWtTqM7_981QKTHL9VaOm7j3Zqrg4krl4",
  authDomain: "async-4e092.firebaseapp.com",
  projectId: "async-4e092",
  storageBucket: "async-4e092.firebasestorage.app",
  messagingSenderId: "410133223381",
  appId: "1:410133223381:web:083ec570828dd761cc8f5c",
  measurementId: "G-3HD0GBS41L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics only if measurementId is available and in a supported environment
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  getAnalytics(app);
}

export default app;

