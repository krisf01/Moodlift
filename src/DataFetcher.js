import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // This comes from react-router, which you need to install if you haven't
import './app.css';
import logoSVG from './images/logo.svg'; // Import the SVG file
import homeIcon from './images/home.svg';

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

//journaling page
export function JournalingPage() {
    const [journalEntry, setJournalEntry] = useState(""); 

    // Handler for input changes
    const handleJournalInputChange = (e) => {
        setJournalEntry(e.target.value);
    };
    
    const[journalprompt,setJournalPrompt] = useState(" Journal Prompt");

    //handler for journal propmt changes
    const handleJournalPromptChange =(e) => {
        setJournalPrompt(e.target.value);
    };

    // Function to get the current date in the format "Month Day, Year"
    const getCurrentDate = () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    return (
        <div className="app-container">
            <div className="purple-rectangle">
                <Link to="/" className="home-link"> {/* Link to the home page */}
                    <img src={homeIcon} alt="Home" className="home-icon" /> {/* Home icon */}
                </Link>
                <p className="date-text">{getCurrentDate()}</p> {/* Date text */}
                <div className="moodlift-text">MoodLift</div> {/* MoodLift text */}
            </div>
            <div>
                <input className='journalpromptinput'
                    value={journalprompt}
                    onChange={handleJournalPromptChange}
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
                    id='Journalinput'
                    value = {journalEntry}
                    onChange={handleJournalInputChange}
                    placeholder="Journal Entry here.."
                    rows = {16}
                    cols = {70}
                ></textarea>
            </div>

        <div>
            <Link to="/savedpost" className='savedbutton'>Saved</Link>
        </div>
        <div>
            <Link to="/friendspost" className="postbutton">Post</Link>
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
                <Link to="/" className="home-link"> {/* Link to the home page */}
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

function handlePostButtonClick() {
    // Example data sent to server
    const postData = { action: "Post" };
    
    fetch('http://localhost:1234/', {  // Ensure the URL and port are correct
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)  // Send data as JSON string
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}


export function FriendsPostPage(){
    
    //const[friendsjournalinput,setsavedsavedfriendsprompt] = useState("Journal Prompt");

    //const handleFriendsPostChange =(e) => {
        //setsavedfriendsprompt(e.target.value);
    //};

    return(
        <div className='app-container'>
            <div className='purple-rectangle'>
            <Link to="/" className="home-link"> {/* Link to the home page */}
                    <img src={homeIcon} alt="Home" className="home-icon" /> {/* Home icon */}
                </Link>
            </div>
        <div>
            <button className='borderbutton3'> </button>
        </div>
        </div>
    );
}

//mood tracker page
export function MoodTrackPage() {
    const [moodEntry, setMoodlEntry] = useState(""); // State to store the journal entry text

    // Handler for input changes
    const handleMoodInputChange = (e) => {
        setMoodlEntry(e.target.value);
    };

    return (
        <div className="app-container">
            <h1>Mood Tracker</h1>
            {/* Textarea for journaling */}
            <div className="input-box">
                <textarea
                    value={moodEntry}
                    onChange={handleMoodInputChange}
                    placeholder="Write your mood here..."
                    aria-label="Happy, Sad, Excited"
                    rows="6" 
                ></textarea>
            </div>
        </div>
    );
}

//Resources Page
export function ResourcePage() {
    //this a temporary place holder url
    const [resourceUrl] = useState("https://https://www.nimh.nih.gov/health/find-help.com");

    return (
        <div className="app-container" style={{textAlign: 'center'}}>
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
