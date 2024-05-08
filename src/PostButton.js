// src/PostButton.js
import React from 'react';

const PostButton = () => {
    const handlePostClick = () => {
        console.log('Button was clicked');
        postDataToServer();
    };

    const postDataToServer = () => {
        const data = {
            content: "This is a test post",
            timestamp: new Date().toISOString()
        };
    
        fetch('http://localhost:1234/', {  // Adjust the URL to your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return <button onClick={handlePostClick}>Post to Server</button>;
};

export default PostButton;