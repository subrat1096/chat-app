import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC8hNufWXfLIfi6pR7C1VcdcQ0Io7TKpg",
  authDomain: "talkrr-9f7b0.firebaseapp.com",
  projectId: "talkrr-9f7b0",
  storageBucket: "talkrr-9f7b0.appspot.com",
  messagingSenderId: "29265966865",
  appId: "1:29265966865:web:09af79b47d4000e6223eb0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
