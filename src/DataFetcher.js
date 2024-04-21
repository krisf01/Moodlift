// DataFetcher.js
import React, { useState, useEffect } from 'react';

function DataFetcher() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:1234/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="app-container">
            <div className="title">
                <h1>MoodLift: Empowering University Students to Navigate Mental Wellness</h1>
            </div>
            <div>
                <h2>Data from Flask:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}

export default DataFetcher;
