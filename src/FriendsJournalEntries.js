import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';
import logoSVG from './images/logo.svg';
import homeIcon from './images/home.svg';
import { useNavigate } from 'react-router-dom';

function FriendsJournalEntries() {
    const [journalEntries, setJournalEntries] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found");
            return;
        }

        fetch(`http://localhost:1234/get_friends_journal_entries?user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setJournalEntries(data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching friends\' journal entries:', error));
    }, [userId]);

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <div className="entries-container">
            <div className='purple-rectangle'>
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            
            <h3 className='friends-name'>Friends' Journal Entries</h3>
            {journalEntries.map(entry => (
                <div key={entry.timestamp} >

                    <p><strong>{entry.friend_email}</strong></p>
                   <div className='prompt-container'>
                    <button className='borderbutton5'>
                    <input
                        className='moodliftprompt4'
                        value ={entry.prompt}
                        readOnly
                    />
                    
                    <div>
                
                    <textarea
                        className='journalinput5'
                        value={entry.entry}
                        readOnly
                        rows={10}
                        cols={50}
                        />
                    
                   </div>
                   </button>
                   </div>
                   
                    <p>{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default FriendsJournalEntries;
