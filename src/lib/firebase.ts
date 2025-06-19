
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// import { getFirestore, Firestore } from 'firebase/firestore'; // If needed later
// import { getStorage, FirebaseStorage } from 'firebase/storage'; // If needed later

// IMPORTANT: REPLACE THESE WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION
// Ideally, these should come from environment variables (e.g., process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
// For quick setup, you can temporarily hardcode them here, but ensure they are secured before deployment.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY_HERE_REPLACE_ME",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN_HERE_REPLACE_ME",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID_HERE_REPLACE_ME",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET_HERE_REPLACE_ME",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID_HERE_REPLACE_ME",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID_HERE_REPLACE_ME",
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

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
