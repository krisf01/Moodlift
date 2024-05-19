import React, { useEffect, useState } from 'react';

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

    return (
        <div className="friends-journal-entries">
            <h3>Friends' Journal Entries</h3>
            {journalEntries.map(entry => (
                <div key={entry.timestamp} className="journal-entry">
                    <p><strong>{entry.friend_email}</strong></p>
                    <p>{entry.prompt}</p>
                    <p>{entry.entry}</p>
                    <p>{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default FriendsJournalEntries;
