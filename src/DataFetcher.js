import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';
import logoSVG from './images/logo.svg';
import homeIcon from './images/home.svg';
import { useNavigate } from 'react-router-dom';

export function DataFetcher() {
    const [data, setData] = useState(null);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        fetch('http://localhost:1234/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="main-content">
            <div className="logo">
                <img src={logoSVG} alt="logo" />
            </div>
            <div className="button-nav-container">
                <Link to="/journaling" className="nav-button">Journaling</Link>
                <Link to="/mood-tracker" className="nav-button">Mood Tracker</Link>
                <Link to="/resources" className="nav-button">Resources</Link>
                <Link to="/friends" className="nav-button">Friends</Link>
                <Link to="/spotify-recommendations" className="nav-button">Spotify</Link> 
            </div>
        </div>
    );
}

export function HomePage() {
    const [data, setData] = useState(null);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        fetch('http://localhost:1234/api/data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="main-content">
            <div className="logo">
                <img src={logoSVG} alt="logo" />
            </div>
            <div className="button-nav-container">
                <Link to="/journaling" className="nav-button">Journaling</Link>
                <Link to="/mood-tracker" className="nav-button">Mood Tracker</Link>
                <Link to="/resources" className="nav-button">Resources</Link>
                <Link to="/friends" className="nav-button">Friends</Link>
                <Link to="/spotify-recommendations" className="nav-button">Spotify</Link> 
            </div>
        </div>
    );
}

export function NavigationBar() {
    return (
        <div className="button-nav-container">
            <Link to="/journaling" className="nav-button journaling">Journaling</Link>
            <Link to="/mood-tracker" className="nav-button mood-tracker">Mood Tracker</Link>
            <Link to="/resources" className="nav-button resources">Resources</Link>
            <Link to="/friends" className="nav-button">Friends</Link>
            <Link to="/spotify-recommendations" className="nav-button">Spotify</Link> 
        </div>
    );
}

//journaling page
export function JournalingPage() {
    const [journalEntry, setJournalEntry] = useState("");
    const [journalPrompt, setJournalPrompt] = useState("Click to generate a journal prompt");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Retrieve the user ID from local storage or wherever it is stored
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            // Handle the case where user ID is not available
            console.error('User ID not found');
        }
    }, []);

    const handleJournalInputChange = (e) => {
        setJournalEntry(e.target.value);
    };

    const fetchJournalPrompt = () => {
        fetch('http://localhost:1234/generate-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            setJournalPrompt(data.prompt);
        })
        .catch(error => console.error('Error fetching journal prompt:', error));
    };

    const handlePostToServer = async () => {
        const postData = {
            user_id: userId,
            journalEntry,
            journalPrompt,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:1234/api/post_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className="app-container">
            <div className="purple-rectangle">
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{new Date().toLocaleDateString()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <div>
                <input className='journalpromptinput'
                    value={journalPrompt}
                    onClick={fetchJournalPrompt}
                    readOnly={true}
                ></input>
            </div>
            <div>
                <button className='borderbutton'>layout</button>
            </div>
            <div>
                <textarea className='journalinput'
                    value={journalEntry}
                    onChange={handleJournalInputChange}
                    placeholder="Journal Entry here.."
                    rows={16}
                    cols={70}
                ></textarea>
            </div>
            <div>
                <Link to="/savedpost" className='savedbutton'>Saved</Link>
            </div>
            <div>
                <button className='postbutton' onClick={handlePostToServer}>Post</button>
        </div>
        <div>
        <Sidebar />
    </div>
    </div>
);
}

// ok
export function SavedPostPage() {
    const [journalEntries, setJournalEntries] = useState([]);
    const userId = localStorage.getItem('user_id'); // Retrieve the user ID from local storage

    useEffect(() => {
        fetch(`http://localhost:1234/api/journal_entries?user_id=${userId}`)
            .then(response => response.json())
            .then(data => setJournalEntries(data.entries))
            .catch(error => console.error('Error fetching journal entries:', error));
    }, [userId]);

    const getCurrentDate = (timestamp) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(timestamp).toLocaleDateString('en-US', options);
    };
    return(
        <div className='app-container'>
            <div className='purple-rectangle'>
                <Link to="/home" className="home-link"> {/* Link to the home page */}
                    <img src={homeIcon} alt="Home" className="home-icon" /> {/* Home icon */}
                </Link>
                <p className="date-text">{new Date().toLocaleDateString()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <div>
                <button className='borderbutton1'> </button>
            </div>
            <div>
                <button className='borderbutton2'> </button>
            </div>
            <div> <Sidebar /> </div>
            <div className='entries-container'>
                {journalEntries.map(entry => (
                    <div key={entry.id} className='entry'>
                        <div className='prompt-container'>
                            <input 
                                className='moodliftprompt' 
                                value={entry.prompt} 
                                readOnly 
                            />
                        </div>
                        <textarea 
                            className='journalinput1' 
                            value={entry.entry} 
                            readOnly 
                            rows={10} 
                            cols={62}
                        />
                        <p className="date-text1">{getCurrentDate(entry.timestamp)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


// Define mood to playlist mappings
const moodPlaylists = {
    lightblue: '1L0HAb9v2QWDA5ukvSrKSm',
    darkblue: '71UaDNUlLUAfI1InekHfDE',
    red: '1k6j9JYvCj4NOun0oRzFo2',
    lightgreen: '7LxQn9LkTOziptWIYGvDYf',
    purple: '4DCdpcRRUbaCWNry9id3ln',
    orange: '7gIIFGbB3Wnf4nhxRjA9nj',
    yellow: '5NsqNSKzy6Dvi14VueSG4r',
    pink: '6cloGJYo5XmNjHRMsCGup0',
    gray: '59CuzXSgNnUYSvPBta6owk',
};

//mood tracker page
export function MoodTrackPage() {
    const [currentPlaylist, setCurrentPlaylist] = useState("");
    const userId = localStorage.getItem('user_id'); // Retrieve the user ID from local storage

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const loginToSpotify = () => {
        window.location.href = "http://localhost:1234/spotify/login";
    };

    const embedSpotifyPlaylist = (playlistId) => {
        const playlistContainer = document.getElementById('spotify-playlist-container');
        let iframe = playlistContainer.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'border-radius:12px');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
            iframe.setAttribute('loading', 'lazy');
            iframe.width = '100%';
            iframe.height = '352';
            iframe.frameBorder = '0';
            playlistContainer.appendChild(iframe);
        }
        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
    };

    const toggleColor = (event, mood) => {
        console.log("in toggleColor ");
        const buttons = document.querySelectorAll('.circle-button');
        buttons.forEach(function(button){
            if (button !== event.target) {
                button.classList.toggle('disabled');
            }
        } );
        console.log('event target is', event.target.classList);
        event.target.classList.toggle('clicked');
        handleMoodtoServer(mood);
        const playlistId = moodPlaylists[mood];
        if (currentPlaylist !== playlistId) {
            setCurrentPlaylist(playlistId);
            embedSpotifyPlaylist(playlistId);
        } else {
            event.target.classList.remove('clicked');
            setCurrentPlaylist("");
            document.getElementById('spotify-playlist-container').innerHTML = ''; // Clear the playlist
        }
    };

    const handleMoodtoServer = async (mood) => {
        const postData = {
            user_id: userId,
            mood,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:1234/api/mood_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            console.log(data);
            console.log('Successfuly saved mood');
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className="mood-track-container">
            <div className="purple-rectangle">
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <div className="blue-background">
                <div className="moodtracker-section">
                    <h2>What is your mood for today?</h2>
                    <div className="moodtracker-rectangle">
                        {Object.keys(moodPlaylists).map(mood => (
                            <button
                                key={mood}
                                className={`circle-button ${mood}`}
                                onClick={(e) => toggleColor(e, mood)}
                            >
                            </button>
                        ))}
                    </div>
                </div>
                <div className="login-button">
                    <button onClick={loginToSpotify}>Login to Spotify</button>
                </div>
                <div id="spotify-playlist-container">
                    {/* This div will hold the Spotify iframe */}
                </div>
            </div>
        </div>
    );
}

//Resources Page
export function ResourcePage() {
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    // URLs updated to point to real resources
    const link1 = "https://www.verywellmind.com/tips-to-reduce-stress-3145195";
    const link2 = "https://www.webmd.com/balance/tips-to-control-stress";
    const link3 = "https://www.youtube.com/watch?v=Eupk56SG76M";
    const link4 = "https://www.youtube.com/watch?v=abcd";
    const link5 = "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC"; // Random happy public Spotify playlist
    const link6 = "https://www.youtube.com/watch?v=ijkl";
    const link7 = "https://www.youtube.com/watch?v=mnop";
    const link8 = "https://www.youtube.com/watch?v=qrst";

    const googleLink1 = "https://www.google.com/search?q=link1";
    const googleLink2 = "https://www.google.com/search?q=link2";
    const googleLink3 = "https://www.google.com/search?q=link3";
    const googleLink4 = "https://www.google.com/search?q=link4";
    const googleLink5 = "https://www.google.com/search?q=link5";
    const googleLink6 = "https://www.google.com/search?q=link6";

    const appleLink1 = "https://www.apple.com";
    const appleLink2 = "https://www.apple.com";
    const appleLink3 = "https://www.apple.com";
    const appleLink4 = "https://www.apple.com";
    const appleLink5 = "https://www.apple.com";
    const appleLink6 = "https://www.apple.com";

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent(null);
    };

    return (
        <div className="app-container">
            <div className="background-pattern"></div> {/* Background pattern for visual styling */}
            <div className="circle academic">Academic</div> {/* Academic circle */}
            <div className="circle social">Social</div> {/* Social circle */}
            <div className="circle personal">Personal</div> {/* Personal circle */}
            <div className="purple-rectangle">
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <h1>Resources</h1>
            <div className="resource-grid">
                <div className="resource-item">
                    <div className="sunshine">
                        <div className="sunshine-face"></div>
                    </div>
                    <div className="resource-textbox">How to Practice Stress Management Techniques</div>
                    <button onClick={() => handleOpenModal(
                      <div>
                        <p>How to Practice Stress Management Techniques</p>
                        <a href={googleLink1} target="_blank" rel="noopener noreferrer">Click here to view part 1</a><br />
                        <a href={googleLink2} target="_blank" rel="noopener noreferrer">Click here to view part 2</a><br />
                        <a href={googleLink3} target="_blank" rel="noopener noreferrer">Click here to view part 3</a><br />
                        <p>Additional resources:</p>
                        <a href={googleLink4} target="_blank" rel="noopener noreferrer">Click here to view part 4</a><br />
                        <a href={googleLink5} target="_blank" rel="noopener noreferrer">Click here to view part 5</a><br />
                        <a href={googleLink6} target="_blank" rel="noopener noreferrer">Click here to view part 6</a>
                      </div>
                    )} className="resource-link">Why is it Important...</button>
                </div>
                <div className="resource-item">
                    <div className="resource-textbox">Helpful Tips</div>
                    <button onClick={() => handleOpenModal(
                      <div>
                        <p>Helpful Tips</p>
                        <a href={appleLink1} target="_blank" rel="noopener noreferrer">Click here to view part 1</a><br />
                        <a href={appleLink2} target="_blank" rel="noopener noreferrer">Click here to view part 2</a><br />
                        <a href={appleLink3} target="_blank" rel="noopener noreferrer">Click here to view part 3</a><br />
                        <p>Additional resources:</p>
                        <a href={appleLink4} target="_blank" rel="noopener noreferrer">Click here to view part 4</a><br />
                        <a href={appleLink5} target="_blank" rel="noopener noreferrer">Click here to view part 5</a><br />
                        <a href={appleLink6} target="_blank" rel="noopener noreferrer">Click here to view part 6</a>
                      </div>
                    )} className="resource-link">Helpful Videos...</button>
                </div>
                <div className="resource-item">
                    <div className="earth">
                        <div className="earth-face"></div>
                    </div>
                    <div className="resource-textbox">Self Care</div>
                    <button onClick={() => handleOpenModal(
                      <div>
                        <p>Self Care</p>
                        <a href={link3} target="_blank" rel="noopener noreferrer">Click here to view part 1</a><br />
                        <a href={link4} target="_blank" rel="noopener noreferrer">Click here to view part 2</a><br />
                        <a href={link5} target="_blank" rel="noopener noreferrer">Click here to view part 3</a><br />
                        <p>Additional self care resources:</p>
                        <a href={link6} target="_blank" rel="noopener noreferrer">Click here to view part 4</a><br />
                        <a href={link7} target="_blank" rel="noopener noreferrer">Click here to view part 5</a><br />
                        <a href={link8} target="_blank" rel="noopener noreferrer">Click here to view part 6</a>
                      </div>
                    )} className="resource-link">Play Here...</button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <div className="modal-content">
                            {modalContent}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:1234/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            
            const data = await response.json();
            if (data.api_key) {
                sessionStorage.setItem('api_key', data.api_key);
                window.location.href = '/'; // Redirect to the main page
            } else {
                alert('Login failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed: Please check console for more details.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

function Sidebar(){

    return (
    <div className='sidebar'> 
        <ul className='sidebarlist'> 
            {SidebarData.map((val,key)=> {
            return(
            <li 
            key={key} 
            className="row"
            id={window.location.pathname == val.link ? "active":""}
            onClick={()=>{window.location.href = val.link}}> 
            <div>
                {val.title}
            </div> 
            </li>
            );
            })}
        </ul>
    </div>
    );
}

export const SidebarData = [
    {
        title: "view private entries",
        link: "/savedpost",
    },
    {
        title: "new entry",
        link: "/journaling",
    },
]

//spotify reccomndations feature
export function SpotifyRecommendations(){
    const [tracks, setTracks] = useState([]);

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        fetch('http://localhost:1234/spotify/recommendations')
            .then(response => response.json())
            .then(data => setTracks(data))
            .catch(error => console.error('Error fetching recommendations:', error));
    }, []);

    const loginToSpotify = () => {
        window.location.href = 'http://localhost:1234/spotify/login';
    };

    const logoutFromSpotify = () => {
        window.location.href = 'http://localhost:1234/spotify/logout';
    };

    return (
        <div className="spotify-recommendations-container">
        <div className="purple-rectangle">
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <h1>Spotify Playlist Recommendations</h1>
            <button onClick={loginToSpotify}>Login to Spotify</button>
            <button onClick={logoutFromSpotify}>Logout from Spotify</button>
            <ul>
                {tracks.map((track, index) => (
                    <li key={index}>
                        {track.name} by {track.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}