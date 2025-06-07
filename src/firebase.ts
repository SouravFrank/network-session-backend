// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getDatabase, Database} from "firebase/database";

// Use process.env for environment variables
const {API_KEY, PROJECT_ID, MESSAGING_SENDER_ID, APP_ID} = process.env;

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db: Database = getDatabase(app);
