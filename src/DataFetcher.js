import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // This comes from react-router, which you need to install if you haven't
import './app.css';
import logoSVG from './images/logo.svg'; // Import the SVG file
import moodLiftIcon from './images/moodlift2.ico';

export function DataFetcher() {
    const [data, setData] = useState(null);
    const [userInput, setUserInput] = useState(""); // New state for the text input

    useEffect(() => {
        fetch('http://localhost:1234/api/data') // Make sure to use the correct port
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Handler for input changes
    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="app-container">
            <link rel="icon" href={moodLiftIcon} type="image/x-icon"/>
            <div className="title">
                <h1>MoodLift: Empowering University Students to Navigate Mental Wellness</h1>
            </div>
            <div className="logo">
                <img src={logoSVG} alt="logo"></img>
            </div>
            <div>
                <h2>Data from Flask:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
            {/* Add a text input box here */}
            <div className="input-box">
                <textarea
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Message"
                    aria-label="Message"
                    rows="4" // Defines the number of lines you want to show by default
                ></textarea>
            </div>
        </div>
    );
}

export function NavigationBar() {
    return (
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/journaling">Journaling</Link> {/* The Link component is used for client-side routing */}
          </li>
          {/* Add additional <li> tags for more navigation links if needed */}
        </ul>
      </nav>
    );
  };

  export function JournalingPage() {
    const [journalEntry, setJournalEntry] = useState(""); // State to store the journal entry text

    // Handler for input changes
    const handleJournalInputChange = (e) => {
        setJournalEntry(e.target.value);
    };

    return (
        <div className="app-container">
            <h1>Journaling</h1>
            {/* Textarea for journaling */}
            <div className="input-box">
                <textarea
                    value={journalEntry}
                    onChange={handleJournalInputChange}
                    placeholder="Write your journal entry here..."
                    aria-label="Journal Entry"
                    rows="6" // Adjust the number of rows as needed
                ></textarea>
            </div>
        </div>
    );
}
