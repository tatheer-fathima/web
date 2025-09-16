// src/components/Navbar.js

import React from 'react';

const Navbar = ({ onLogout }) => {
    return (
        <div className="navbar">
            <h2>Bookmark Manager</h2>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Navbar;
