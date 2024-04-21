import React, { useEffect, useState } from 'react';
import './app.css';

function DataFetcher() {
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
            <div className="title">
                <h1>MoodLift: Empowering University Students to Navigate Mental Wellness</h1>
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

export default DataFetcher;
