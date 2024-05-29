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


export function SavedPostPage(){
    const[moodliftjournalprompt,setmoodliftJournalPrompt] = useState("Journal Prompt");

    //handler for journal propmt changes
    const handleMoodLiftJournalPromptChange =(e) => {
        setmoodliftJournalPrompt(e.target.value);
    };
    //handler for saved input changes
    const[moodliftjournalinput,setsavedjournalprompt] = useState(" this is my journal entry deafult text");

    const handleSavedPostPromptChange =(e) => {
        setsavedjournalprompt(e.target.value);
    };
     // Function to get the current date in the format "Month Day, Year"
     const getCurrentDateSavedPost = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };
    //second saved input changes
    const[moodliftjournalinput1,setsavedjournalprompt1] = useState(" this is my journal entry default text");

    const handleSavedPostPromptChange1 =(e) => {
        setsavedjournalprompt1(e.target.value);
    };
    
    //second handler
    const[moodliftjournalprompt1,setmoodliftJournalPrompt1] = useState("Journal Prompt");

    const handleMoodLiftJournalPromptChange1 =(e) => {
        setmoodliftJournalPrompt1(e.target.value);
    };
    return(
        <div className='app-container'>
            <div className='purple-rectangle'>
                <Link to="/home" className="home-link"> {/* Link to the home page */}
                    <img src={homeIcon} alt="Home" className="home-icon" /> {/* Home icon */}
                </Link>
            </div>
            <div>
                <button className='borderbutton1'> </button>
            </div>
            <div>
                <button className='borderbutton2'> </button>
            </div>
            <div>
                <input className='moodliftprompt'
                    value={moodliftjournalprompt}
                    onChange={handleMoodLiftJournalPromptChange}
                    readOnly={true}
                ></input>
            </div>
            <div> <Sidebar /> </div>
           <div>
                <textarea className='journalinput1'
                    value={moodliftjournalinput}
                    onChange={handleSavedPostPromptChange}
                    readOnly={true}
                    rows = {15}
                    cols = {62}
                ></textarea>
                <p className="date-text1">{getCurrentDateSavedPost()}</p> {/* Date text */}
            <div>
            <input className='moodliftprompt1'
                    value={moodliftjournalprompt1}
                    onChange={handleMoodLiftJournalPromptChange1}
                    readOnly={true}
                ></input>
            </div>
           </div>
                <textarea className="journalinput2"
                    value={moodliftjournalinput1}
                    onChange={handleSavedPostPromptChange1}
                    readOnly={true}
                    rows = {15}
                    cols = {62}
                ></textarea>
        </div>
    );
}

//updated friends page 
export function FriendsPostPage() {
    const navigate = useNavigate();

    // States for journal prompts, entries, and names
    const [journalPrompt, setJournalPrompt] = useState("Journal Prompt");
    const [journalEntry, setJournalEntry] = useState("This is my journal entry default text");
    const [journalPrompt1, setJournalPrompt1] = useState("Journal Prompt");
    const [journalEntry1, setJournalEntry1] = useState("This is another journal entry default text");
    const [name, setName] = useState("");
    const [name1, setName1] = useState("");

    // Handlers for changes
    const handleJournalPromptChange = (e) => {
        setJournalPrompt(e.target.value);
    };

    const handleJournalEntryChange = (e) => {
        setJournalEntry(e.target.value);
    };

    const handleJournalPromptChange1 = (e) => {
        setJournalPrompt1(e.target.value);
    };

    const handleJournalEntryChange1 = (e) => {
        setJournalEntry1(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNameChange1 = (e) => {
        setName1(e.target.value);
    };

    // Function to get the current date in the format "Month Day, Year"
    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    // Function to handle the post operation
    const handlePost = async () => {
        const postData = {
            content: journalEntry, // Use dynamic content from journal entry
            name: name, // Include the name with the post data
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('http://localhost:1234/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            console.log(data);
            navigate('/some-success-route');
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    return (
        <div className='app-container friends-post-page-container'>
            <div className='purple-rectangle'>
                <div style={{ position: 'absolute', top: '30px', left: '20px' }}>
                    <h1 style={{ color: 'black' }}>Friends</h1>
                </div>
                <Link to="/home" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
            </div>
            <div>
                <button onClick={handlePost}>Post Data</button>
            </div>
            <div>
                <input className='journalPrompt friends-journal-prompt-input'
                    value={journalPrompt}
                    onChange={handleJournalPromptChange}
                    readOnly={true}
                />
            </div>
            <div>
                <textarea className='journalEntry friends-journal-input'
                    value={journalEntry}
                    onChange={handleJournalEntryChange}
                    readOnly={true}
                    rows={15}
                    cols={62}
                />
                <p className="date-text">{getCurrentDate()}</p>
                <input className='nameInput friends-name-input'
                    placeholder='Name:'
                    value={name}
                    onChange={handleNameChange}
                />
            </div>
            <div>
                <input className='journalPrompt1 friends-journal-prompt-input'
                    value={journalPrompt1}
                    onChange={handleJournalPromptChange1}
                    readOnly={true}
                />
            </div>
            <div>
                <textarea className="journalEntry1 friends-journal-input"
                    value={journalEntry1}
                    onChange={handleJournalEntryChange1}
                    readOnly={true}
                    rows={15}
                    cols={62}
                />
                <input className='nameInput1 friends-name-input'
                    placeholder='Name:'
                    value={name1}
                    onChange={handleNameChange1}
                />
            </div>
            <div> {/* Placeholder for Sidebar component */}
                <Sidebar />
            </div>
        </div>
    );
}
//close friends pgae


//mood tracker page
export function MoodTrackPage() {
    const [moodEntry, setMoodlEntry] = useState(""); // State to store the journal entry text

    // Handler for input changes
    const handleMoodInputChange = (e) => {
        setMoodlEntry(e.target.value);
    };

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <div className="mood-track-container">
            <div className="purple-rectangle">
                <Link to="/home" className="home-link"> {/* Link to the home page */}
                    <img src={homeIcon} alt="Home" className="home-icon" /> {/* Home icon */}
                </Link>
                <p className="date-text">{getCurrentDate()}</p> {/* Date text */}
                <div className="moodlift-text">MoodLift</div> {/* MoodLift text */}
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
                <Link to="/" className="home-link">
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
        title: "view public posts",
        link: "/friendspost",
    },
    {
        title: "view private entries",
        link: "/savedpost",
    },
    {
        title: "new entry",
        link: "/journaling",
    },
]