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
        <nav style={{ textAlign: 'center' }}> {/* Center the navigation content */}
          <button className="centered-button">
            <Link to="/journaling" className="button-link">
              Journaling
            </Link>
          </button>
          <button className="centered-button">
            <Link to="/mood-tracker" className="button-link">
              Mood Tracker
            </Link>
          </button>
          <button className="centered-button">
            <Link to="/resources" className="button-link">
              Resources
            </Link>
          </button>
        </nav>
      );
    }
//journaling page
  export function JournalingPage() {
    const [journalEntry, setJournalEntry] = useState(""); 

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

//mood tracker page
export function MoodTrackPage() {
    const [moodEntry, setMoodlEntry] = useState(""); // State to store the journal entry text

    // Handler for input changes
    const handleMoodInputChange = (e) => {
        setMoodlEntry(e.target.value);
    };

    return (
        <div className="app-container">
            <h1>Mood Tracker</h1>
            {/* Textarea for journaling */}
            <div className="input-box">
                <textarea
                    value={moodEntry}
                    onChange={handleMoodInputChange}
                    placeholder="Write your mood here..."
                    aria-label="Happy, Sad, Excited"
                    rows="6" 
                ></textarea>
            </div>
        </div>
    );
}

//Resources Page
export function ResourcePage() {
    //this a temporary place holder url
    const [resourceUrl] = useState("https://https://www.nimh.nih.gov/health/find-help.com");

    return (
        <div className="app-container" style={{textAlign: 'center'}}>
            <h1>Resources</h1>
            <div className="resource-display">
                <p>Visit the resource below:</p>
                <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                    {resourceUrl}
                </a>
            </div>
            <p>This is just a test more appropiate linkes will be added later.</p>
        </div>
    );
}
