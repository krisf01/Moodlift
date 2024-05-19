import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FriendRequests from './FriendRequests';

export function FriendsPage() {
    const [userInput, setUserInput] = useState("");
    const [friends, setFriends] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('user_id'));

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found");
            return;
        }

        // Fetch friends
        fetch(`http://localhost:1234/get_friends?user_id=${userId}`)
            .then(response => response.json())
            .then(data => setFriends(data))
            .catch(error => console.error('Error fetching friends:', error));
    }, [userId]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSearchAndAddFriend = () => {
        if (!userInput) {
            alert("Please enter an email address to search.");
            return;
        }

        fetch(`http://localhost:1234/search_users_by_email?email=${userInput}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const friendId = data[0].id;
                    sendFriendRequest(friendId);
                } else {
                    alert("User not found");
                }
            })
            .catch(error => console.error('Error searching users:', error));
    };

    function sendFriendRequest(friendId) {
        if (!userId) {
            alert('User ID information is missing.');
            return;
        }
    
        fetch('http://localhost:1234/send_friend_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from_user_id: userId,
                to_user_id: friendId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Friend request sent successfully');
                setFriends(prev => [...prev, { id: friendId, email: data.email }]);
            }
        })
        .catch(error => {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request: ' + error.message);
        });
    }    

    return (
        <div className="friends-page">
            <h2>Friends Management</h2>
            <div className="search-friends">
                <input 
                    type="text" 
                    value={userInput} 
                    onChange={handleInputChange} 
                    placeholder="Search users by email"
                />
                <button onClick={handleSearchAndAddFriend}>Search and Add Friend</button>
            </div>
            <div className="friend-list">
                <h3>Your Friends</h3>
                {friends.map(friend => (
                    <div key={friend.id}>{friend.email}</div>
                ))}
            </div>
            <FriendRequests />
        </div>
    );
}

export default FriendsPage;
