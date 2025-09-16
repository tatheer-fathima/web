// src/App.js

import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState(false);

    const handleLogin = (tok) => {
        localStorage.setItem('token', tok);
        setToken(tok);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    if (!token) {
        return showRegister ? 
            <Register onSwitch={() => setShowRegister(false)} /> : 
            <div className="container">
                <Login onLogin={handleLogin} />
                <button onClick={() => setShowRegister(true)}>Register</button>
            </div>;
    }

    return <Home token={token} onLogout={handleLogout} />;
}

export default App;
