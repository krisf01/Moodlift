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
            <button className='postbutton' onClick={handlePostToServer}>Post</button>
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

export function FriendsPostPage() {
    const navigate = useNavigate();

    // Function to handle the post operation
    const handlePost = async () => {
        const postData = {
            content: 'Hardcoded content here', // You can replace this with dynamic content if needed
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
            // Navigate to another route upon success or handle success scenario
            navigate('/some-success-route');
        } catch (error) {
            console.error('Error posting data:', error);
            // Optionally handle the error scenario, e.g., show an error message
        }
    };

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
