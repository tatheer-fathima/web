// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            onLogin(res.data.token);
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    );
};

export default Login;
