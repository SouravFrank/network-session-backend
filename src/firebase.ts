// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getDatabase, Database} from "firebase/database";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.ENV.API_KEY,
  authDomain: `${process.ENV.PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.ENV.PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: "session-insights-ryswj",
  storageBucket: `${process.ENV.PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.ENV.MESSAGING_SENDER_ID,
  appId: process.ENV.APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db: Database = getDatabase(app);
