// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDY6H_bduOzuNV5CJilizlFfdir2nGtJps",
  authDomain: "moodlift-90c56.firebaseapp.com",
  projectId: "moodlift-90c56",
  storageBucket: "moodlift-90c56.appspot.com",
  messagingSenderId: "3601349600",
  appId: "1:3601349600:web:82f72c2af95d350b70c985",
  measurementId: "G-YP660TBRLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

//export { app, analytics, auth };