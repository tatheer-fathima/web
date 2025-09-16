import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const API_URL = "https://web-1-uhjk.onrender.com/api/auth/register";

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const register = async () => {
        if (!username || !password) return showToast("Username and password are required");
        try {
            await axios.post(API_URL, { username, password });
            showToast("Registration successful");
            setUsername('');
            setPassword('');
            setTimeout(() => onSwitch(), 1000); // Switch to login after success
        } catch (err) {
            showToast(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2>Register</h2>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register}>Register</button>
            <p>
                Already have an account? <span style={{ color: '#3498db', cursor: 'pointer' }} onClick={onSwitch}>Login</span>
            </p>
            <Toast message={toastMessage} />
        </div>
    );
};

export default Register;
