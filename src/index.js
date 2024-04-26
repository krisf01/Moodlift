import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavigationBar, DataFetcher, JournalingPage, MoodTrackPage, ResourcePage } from './DataFetcher'; // Use named imports here
import './app.css';

ReactDOM.render(
    <React.StrictMode>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<DataFetcher />} />
          <Route path="/journaling" element={<JournalingPage />} />
          <Route path="/mood-tracker" element={<MoodTrackPage />} />
          <Route path="/resources" element={<ResourcePage />} />
        </Routes>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
