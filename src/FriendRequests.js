import React, { useState, useEffect } from 'react';

function FriendRequests() {
    const [requests, setRequests] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetch(`http://localhost:1234/get_friend_requests?user_id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching friend requests:', error));
    }, [userId]);

    function handleAccept(requestId, friendId) {
        fetch('http://localhost:1234/accept_friend_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                friend_id: friendId,
                request_id: requestId
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Friend request accepted');
            setRequests(requests.filter(request => request.request_id !== requestId));
        })
        .catch(error => console.error('Error accepting friend request:', error));
    }

    function handleReject(requestId) {
        fetch('http://localhost:1234/reject_friend_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                request_id: requestId
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Friend request rejected');
            setRequests(requests.filter(request => request.request_id !== requestId));
        })
        .catch(error => console.error('Error rejecting friend request:', error));
    }

    return (
        <div>
            <h1>Friend Requests</h1>
            {requests.map(request => (
                <div key={request.request_id}>
                    <p>Request from: {request.from_user_email}</p>
                    <button onClick={() => handleAccept(request.request_id, request.from_user_id)}>Accept</button>
                    <button onClick={() => handleReject(request.request_id)}>Reject</button>
                </div>
            ))}
        </div>
    );
}

export default FriendRequests;
