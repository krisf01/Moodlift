import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:1234/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            alert(`Registration successful! Your API key is: ${data.api_key}`);
            localStorage.setItem('api_key', data.api_key);
            localStorage.setItem('user_id', data.uid);  // Store user ID
            setIsRegistering(false);
            navigate('/home'); // Navigate to the new home journaling page
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed: ' + error.message);
        }
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:1234/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('api_key', data.api_key);
            localStorage.setItem('user_id', data.uid);  // Store user ID
            navigate('/home'); // Navigate to the new home journaling page
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <div className="login-container">
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                <p>
                    {isRegistering ? (
                        <>Already have an account? <button type="button" onClick={() => setIsRegistering(false)}>Log in</button></>
                    ) : (
                        <>Don't have an account? <button type="button" onClick={() => setIsRegistering(true)}>Register</button></>
                    )}
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
