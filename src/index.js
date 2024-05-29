import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage, JournalingPage, MoodTrackPage, ResourcePage, SavedPostPage, FriendsPostPage } from './DataFetcher';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import FriendsPage from './FriendsPage';
import FriendsJournalEntries from './FriendsJournalEntries'; // Import the component
import './app.css';

const ProtectedRoute = ({ element }) => {
    const apiKey = localStorage.getItem('api_key');
    return apiKey ? element : <Navigate to="/login" />;
};

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
                <Route path="/journaling" element={<ProtectedRoute element={<JournalingPage />} />} />
                <Route path="/mood-tracker" element={<ProtectedRoute element={<MoodTrackPage />} />} />
                <Route path="/resources" element={<ProtectedRoute element={<ResourcePage />} />} />
                <Route path="/savedpost" element={<ProtectedRoute element={<SavedPostPage />} />} />
                <Route path="/friendspost" element={<ProtectedRoute element={<FriendsPostPage />} />} />
                <Route path="/friends" element={<ProtectedRoute element={<FriendsPage />} />} />
                <Route path="/friends-journal-entries/:friendId" element={<ProtectedRoute element={<FriendsJournalEntries />} />} /> {/* New route */}
                <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login by default */}
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);