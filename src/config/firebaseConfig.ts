// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

if (Math.random() > 0)
  throw new Error(
    "you will need to add firebase config for this to work: src/config/firebaseConfig.ts"
  );

export const app = initializeApp({
  /* YOUR CONFIG GOES HERE */
});
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
