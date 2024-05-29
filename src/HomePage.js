import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';
import logoSVG from './images/logo.svg';
import homeIcon from './images/home.svg';

export function HomePage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:1234/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="main-content">
            <div className="logo">
                <img src={logoSVG} alt="logo" />
            </div>
            <div className="button-nav-container">
                <Link to="/journaling" className="nav-button">Journaling</Link>
                <Link to="/mood-tracker" className="nav-button">Mood Tracker</Link>
                <Link to="/resources" className="nav-button">Resources</Link>
                <Link to="/friends" className="nav-button">Friends</Link>
            </div>
        </div>
    );
}

export default HomePage;
