// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcLmDN0n0IBw88c9ye8nEpdTfwqCwcfks",
  authDomain: "voting-app-5249d.firebaseapp.com",
  projectId: "voting-app-5249d",
  storageBucket: "voting-app-5249d.firebasestorage.app",
  messagingSenderId: "594290799271",
  appId: "1:594290799271:web:4bf992a5e62209bf3ae182",
  measurementId: "G-3M6LVLRJW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;