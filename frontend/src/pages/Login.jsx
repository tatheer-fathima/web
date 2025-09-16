import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const API_URL = "https://web-1-uhjk.onrender.com/api/auth/login";

const Login = ({ onLogin, onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const login = async () => {
        if (!username || !password) return showToast("Username and password are required");
        try {
            const res = await axios.post(API_URL, { username, password });
            showToast("Login successful");
            setUsername('');
            setPassword('');
            onLogin(res.data.token);
        } catch (err) {
            showToast(err.response?.data?.error || "Invalid credentials");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2>Login</h2>
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
            <button onClick={login}>Login</button>
            <p>
                Don't have an account? <span style={{ color: '#3498db', cursor: 'pointer' }} onClick={onSwitch}>Register</span>
            </p>
            <Toast message={toastMessage} />
        </div>
    );
};

export default Login;
