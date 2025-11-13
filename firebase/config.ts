// firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoNVDbriqN3OCGjzBj8RHm_0IvOjQAAnM",
  authDomain: "runningbuddy-1d41e.firebaseapp.com",
  projectId: "runningbuddy-1d41e",
  storageBucket: "runningbuddy-1d41e.firebasestorage.app",
  messagingSenderId: "289461051591",
  appId: "1:289461051591:web:9d6cdd400e82d37e8f9ee2",
};

// ✅ Next.js는 핫리로드가 많아서 App이 중복 초기화되지 않게 처리
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
