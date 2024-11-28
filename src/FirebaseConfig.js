// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYKwDq5PZwwyfVfG9CSJ9l32MKnxFCvwg",
  authDomain: "jp-learning-app.firebaseapp.com",
  projectId: "jp-learning-app",
  storageBucket: "jp-learning-app.appspot.com",
  messagingSenderId: "1078421967934",
  appId: "1:1078421967934:ios:0d22fd3987f3b5e03fad6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
