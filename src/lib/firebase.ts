
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// import { getFirestore, Firestore } from 'firebase/firestore'; // If needed later
// import { getStorage, FirebaseStorage } from 'firebase/storage'; // If needed later

// IMPORTANT: REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION
// Ideally, these should come from environment variables (e.g., process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
// For quick setup, you can temporarily hardcode them here, but ensure they are secured before deployment.
const firebaseConfig = {
    apiKey: "AIzaSyB-Va6dR0-uHIpDm6R0RxiStpgVHmYC_4A",
    authDomain: "e-commerce-lite-rvqji.firebaseapp.com",
    projectId: "e-commerce-lite-rvqji",
    storageBucket: "e-commerce-lite-rvqji.firebasestorage.app",
    messagingSenderId: "80780006682",
    appId: "1:80780006682:web:4950e3ddf66a5cfe9088a3"
  };
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // If needed later
// const storage: FirebaseStorage = getStorage(app); // If needed later

export { app, auth /*, db, storage */ };
