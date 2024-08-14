// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

export const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
export const emulatorOffline = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR_OFFLINE === "true";

const projectId = "next-firebase-emulator";

const firebaseConfig = {
  apiKey: "AIzaSyBSTs7Lj0jmNn6Y0wrz-KSKVWN6DXusy-Q",
  authDomain: "next-firebase-emulator.firebaseapp.com",
  projectId: `${emulatorOffline ? "demo-" : ""}${projectId}`,
  storageBucket: "next-firebase-emulator.appspot.com",
  messagingSenderId: "1064012878807",
  appId: "1:1064012878807:web:76cdd163fc5277b2ceb192",
  measurementId: "G-V4DV7EWKPV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);

if (useEmulator) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}
