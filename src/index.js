import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavigationBar, DataFetcher, JournalingPage } from './DataFetcher'; // Use named imports here
import './app.css';

//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<DataFetcher />} />
          <Route path="/journaling" element={<JournalingPage />} />
        </Routes>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDY6H_bduOzuNV5CJilizlFfdir2nGtJps",
//   authDomain: "moodlift-90c56.firebaseapp.com",
//   projectId: "moodlift-90c56",
//   storageBucket: "moodlift-90c56.appspot.com",
//   messagingSenderId: "3601349600",
//   appId: "1:3601349600:web:82f72c2af95d350b70c985",
//   measurementId: "G-YP660TBRLL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
