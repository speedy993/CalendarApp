import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Inicjalizacja Firebase

const firebaseConfig = {
  apiKey: "AIzaSyDXW4rG0MfNLTTZrgAGz98qg89V4HMV5QQ",
  authDomain: "calendar-8831f.firebaseapp.com",
  projectId: "calendar-8831f",
  storageBucket: "calendar-8831f.appspot.com",
  messagingSenderId: "456247945241",
  appId: "1:456247945241:web:7921e962e73f80d930e288"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Zostawiłem konsol log na wszelki wypadek :)
console.log('Firebase initialized:', db);

export { db };
