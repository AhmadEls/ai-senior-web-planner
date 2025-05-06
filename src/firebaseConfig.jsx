import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsth-iW9yrzRUhW7P1zASf870My1IZTjQ",
  authDomain: "ai-trip-planner-cf03d.firebaseapp.com",
  projectId: "ai-trip-planner-cf03d",
  storageBucket: "ai-trip-planner-cf03d.appspot.com",
  messagingSenderId: "1074560990468",
  appId: "1:1074560990468:web:87dbd444798b0ce69c7a9",
  measurementId: "G-BSDY67W96F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
