import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // This comes from react-router, which you need to install if you haven't
import './app.css';
import logoSVG from './images/logo.svg'; // Import the SVG file
import homeIcon from './images/home.svg';

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
<<<<<<< HEAD
        <div className="app-container">
            <div className="title">
                <h1>MoodLift: Empowering University Students to Navigate Mental Wellness</h1>
            </div>
            <div>
                <h2>Data from Flask:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
            {/* Add a text input box here */}
            <div className="input-box">
                
                <label>Enter Message</label>  {/*dylan added this , its a enter message prompt*/}
                
                <textarea
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Message"
                    aria-label="Message"
                    rows="4" // Defines the number of lines you want to show by default
                ></textarea>
                <button type="submit">Save</button>  {/*dylan added this "save button"*/}
                
            </div>
        </div>
    ); 
=======
        <div className="main-content">
        <div className="logo">
          <img src={logoSVG} alt="logo"></img>
        </div>
        <div className="button-nav-container">
          <Link to="/journaling" className="nav-button">Journaling</Link>
          <Link to="/mood-tracker" className="nav-button">Mood Tracker</Link>
          <Link to="/resources" className="nav-button">Resources</Link>
        </div>
      </div>
      );
>>>>>>> 48618accb7ace45df7e7a72d663a998a04bb5671
}

export function NavigationBar() {
    return (
        <div className="button-nav-container">
            <Link to="/journaling" className="nav-button journaling">Journaling</Link>
            <Link to="/mood-tracker" className="nav-button mood-tracker">Mood Tracker</Link>
            <Link to="/resources" className="nav-button resources">Resources</Link>
        </div>
    );
}

//journaling page
export function JournalingPage() {
    const [journalEntry, setJournalEntry] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [chatResponse, setChatResponse] = useState("");

    // Function to get the current date in the format "Month Day, Year"
    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const handleJournalInputChange = (e) => {
        setJournalEntry(e.target.value);
    };

    const handleChatInputChange = (e) => {
        setChatInput(e.target.value);
    };

    const handleChatSubmit = () => {
        fetch('http://localhost:1234/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: chatInput })
        })
        .then(response => response.json())
        .then(data => {
            setChatResponse(data.response);
            setChatInput(''); // Clear the chat input after submission
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="app-container">
            <div className="purple-rectangle">
                <Link to="/" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <div className="chat-section">
                <input
                    type="text"
                    value={chatInput}
                    onChange={handleChatInputChange}
                    placeholder="Ask ChatGPT something..."
                />
                <button onClick={handleChatSubmit}>Submit to ChatGPT</button>
            </div>
            <div className="chat-response">
                <p><strong>ChatGPT Response:</strong></p>
                <p>{chatResponse}</p>
            </div>
            <div className="journal-section">
                <textarea
                    value={journalEntry}
                    onChange={handleJournalInputChange}
                    placeholder="Journal Entry here..."
                    rows={14}
                    cols={85}
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
            <div className="resourcelinks">
                <p>Visit the resource below:</p>
                <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                    {resourceUrl}
                </a>
            </div>
            <p>This is just a test more appropiate linkes will be added later.</p>
        </div>
    );
}
