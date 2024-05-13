// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import { DataFetcher, JournalingPage, MoodTrackPage, ResourcePage, SavedPostPage, FriendsPostPage } from './DataFetcher';
import PostButton from './PostButton'; // Import the PostButton component

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<DataFetcher />} />
          <Route path="/post-button" element={<PostButton />} />  // Add the route for the Post Button
          <Route path="/journaling" element={<JournalingPage />} />
          <Route path="/mood-tracker" element={<MoodTrackPage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/savedpost" element={<SavedPostPage />} />
          <Route path="/friendspost" element={<FriendsPostPage />} />
        </Routes>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
);