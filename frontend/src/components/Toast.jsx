import React from 'react';

const Toast = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 1000
        }}>
            {message}
        </div>
    );
};

export default Toast;
