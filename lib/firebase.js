// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDAI-mpc83j79a95vksydz5NMnH0_FOHcI",
  authDomain: "medrush-7ba8b.firebaseapp.com",
  projectId: "medrush-7ba8b",
  storageBucket: "medrush-7ba8b.firebasestorage.app",
  messagingSenderId: "340543660618",
  appId: "1:340543660618:web:eaadfb60cb6ba0f6ea7cb3",
  measurementId: "G-2DJHRCY6T5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();