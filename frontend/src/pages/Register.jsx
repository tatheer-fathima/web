// src/pages/Register.js

import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitch }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const register = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            alert("Registration successful");
            onSwitch();
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={register}>Register</button>
        </div>
    );
};

export default Register;
