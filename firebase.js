// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set, get} from "firebase/database";
import "firebase/database"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPNpvoJOAeHKS7_mPKBCe9C8_FpDoyhow",
  authDomain: "spaceease-58e4c.firebaseapp.com",
  projectId: "spaceease-58e4c",
  storageBucket: "spaceease-58e4c.firebasestorage.app",
  messagingSenderId: "1081694749289",
  appId: "1:1081694749289:web:3c67a4feb255e3c8ca18f8",
  measurementId: "G-WJTDFDY4BG",
  databaseURL: "https://spaceease-58e4c-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()
// const analytics = getAnalytics(app);

export {db, ref, onValue, update, set, get}