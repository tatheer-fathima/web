import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import Toast from '../components/Toast';
import { jsPDF } from 'jspdf';


const Home = ({ token, onLogout }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const fileInputRef = useRef(null);

    const fetchBookmarks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookmarks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookmarks(res.data);
        } catch (err) {
            showToast("Error fetching bookmarks");
        }
    };

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    // Export bookmarks as JSON file
    const exportBookmarks = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My Bookmarks', 14, 20);

    let y = 30;
    bookmarks.forEach((b, index) => {
        doc.setFontSize(14);
        doc.text(`${index + 1}. ${b.title}`, 14, y);
        y += 8;
        doc.setFontSize(12);
        doc.text(`URL: ${b.url}`, 14, y);
        y += 6;
        doc.text(`Category: ${b.category || 'Uncategorized'}`, 14, y);
        y += 6;
        doc.text(`Tags: ${b.tags.join(', ')}`, 14, y);
        y += 6;
        if (b.description) {
            doc.text(`Description: ${b.description}`, 14, y);
            y += 6;
        }
        y += 8;
        // Start new page if too long
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save('bookmarks.pdf');
    showToast("Bookmarks exported as PDF");
};

    // Import bookmarks from JSON file
    const importBookmarks = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                for (let b of imported) {
                    const { title, url, category, tags, description, isFavorite } = b;
                    await axios.post('http://localhost:5000/api/bookmarks', 
                        { title, url, category, tags, description, isFavorite },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                }
                showToast("Bookmarks imported successfully");
                fetchBookmarks();
            } catch (err) {
                showToast("Error importing bookmarks");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <Navbar onLogout={onLogout} />
            <div className="container">
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <button onClick={exportBookmarks}>Export Bookmarks</button>
                    <button onClick={() => fileInputRef.current.click()}>Import Bookmarks</button>
                    <input
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={importBookmarks}
                    />
                </div>
                <BookmarkForm 
                    token={token} 
                    fetchBookmarks={fetchBookmarks} 
                    editingBookmark={editingBookmark} 
                    setEditingBookmark={setEditingBookmark} 
                    showToast={showToast}
                />
                <BookmarkList 
                    bookmarks={bookmarks} 
                    token={token} 
                    fetchBookmarks={fetchBookmarks} 
                    setEditingBookmark={setEditingBookmark}
                    showToast={showToast}
                />
                <Toast message={toastMessage} />
            </div>
        </div>
    );
};

export default Home;
