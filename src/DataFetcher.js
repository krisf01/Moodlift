import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // This comes from react-router, which you need to install if you haven't
import './app.css';
import logoSVG from './images/logo.svg'; // Import the SVG file
import homeIcon from './images/home.svg';
import { useNavigate } from 'react-router-dom';

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
        title: "view saved posts",
        link: "/friendspost",
    },
    {
        title: "  create new entry",
        link: "/journaling",
    },
]

//journaling page
export function JournalingPage() {

    const [journalEntry, setJournalEntry] = useState("");
    const [journalPrompt, setJournalPrompt] = useState("Click to generate a journal prompt");

    // Handler for journal entry changes
    const handleJournalInputChange = (e) => {
        setJournalEntry(e.target.value);
    };

    // Function to fetch a random journal prompt from the Flask server
    const fetchJournalPrompt = () => {
        fetch('http://localhost:1234/generate-prompt', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            setJournalPrompt(data.prompt); // Update the journal prompt with the fetched data
        })
        .catch(error => console.error('Error fetching journal prompt:', error));
    };

    // Function to get the current date in the format "Month Day, Year"
    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    //toggle button handler 
    const [toggled, setToggled] = useState(false);

     //Do a post to to the database when Post button is clicked
     const handlePostToServer = async () => {
        // const postData = {
        //     journalEntry: journalEntry,
        //     journalPrompt: journalprompt,
        //     timestamp: new Date().toISOString()
        // };
        const postData = {
            action: "Post",
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
            // Optionally handle navigation or state updates based on the response
        } catch (error) {
            console.error('Error posting data:', error);
        }
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
            <div>
                <input className='journalpromptinput'
                    value={journalPrompt}
                    onClick={fetchJournalPrompt} // Add click handler here
                    readOnly={true}
                ></input>
            </div>
            <div>
                <button className='borderbutton'>
                    layout
                </button>
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
            <Link to='/friendspost'> 
                <button className='postbutton' onClick={handlePostToServer}>Post</button>
            </Link>
            
    </div>
    <div>
        <Sidebar />
    </div>
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
                <Link to="/" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
            <div className='zindex'>
                <input className='journalPrompt friends-journal-prompt-input'
                    value={journalPrompt}
                    onChange={handleJournalPromptChange}
                    readOnly={true}
                />
            </div>
            <div className='zindex'>
                <textarea className=' friends-journal-input'
                    value={journalEntry}
                    onChange={handleJournalEntryChange}
                    readOnly={true}
                    rows={15}
                    cols={62}
                />
            </div>
            <div><button className='borderbutton4'></button>
                </div>
            <div className='zindex'>
                <input className='journalPrompt1 friends-journal-prompt-input'
                    value={journalPrompt1}
                    onChange={handleJournalPromptChange1}
                    readOnly={true}
                />
            </div>
            <div className='zindex'>
                <textarea className="journalEntry1 friends-journal-input"
                    value={journalEntry1}
                    onChange={handleJournalEntryChange1}
                    readOnly={true}
                    rows={15}
                    cols={62}
                />
            </div>
            <div>
                <button className='borderbutton5'></button>
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
                <Link to="/" className="home-link"> {/* Link to the home page */}
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
    //this a temporary place holder url
    const [resourceUrl] = useState("https://https://www.nimh.nih.gov/health/find-help.com");

    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <div className="app-container" style={{textAlign: 'center'}}>
            <div className="purple-rectangle">
                <Link to="/" className="home-link">
                    <img src={homeIcon} alt="Home" className="home-icon" />
                </Link>
                <p className="date-text">{getCurrentDate()}</p>
                <div className="moodlift-text">MoodLift</div>
            </div>
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