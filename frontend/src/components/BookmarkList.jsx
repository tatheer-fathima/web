import React, { useState } from 'react';
import axios from 'axios';

const BookmarkList = ({ bookmarks, token, fetchBookmarks, setEditingBookmark, showToast }) => {
    const [showFavorites, setShowFavorites] = useState(false);
    const [sortOption, setSortOption] = useState('date'); // or 'title'

    const deleteBookmark = async (id) => {
        if (!window.confirm("Are you sure you want to delete this bookmark?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/bookmarks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Bookmark deleted");
            fetchBookmarks();
        } catch (err) {
            showToast("Error deleting bookmark");
        }
    };

    const toggleFavorite = async (b) => {
        try {
            await axios.put(`http://localhost:5000/api/bookmarks/${b._id}`, 
                { ...b, isFavorite: !b.isFavorite },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast(b.isFavorite ? "Removed from favorites" : "Added to favorites");
            fetchBookmarks();
        } catch (err) {
            showToast("Error updating favorite");
        }
    };

    const filtered = showFavorites ? bookmarks.filter(b => b.isFavorite) : bookmarks;

    const sorted = [...filtered].sort((a, b) => {
        if (sortOption === 'title') {
            return a.title.localeCompare(b.title);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => setShowFavorites(!showFavorites)}>
                    {showFavorites ? "Show All" : "Show Favorites"}
                </button>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ marginLeft: '1rem' }}>
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
            <div className="bookmark-list">
                {sorted.length === 0 && <p>No bookmarks available.</p>}
                {sorted.map((b) => (
                    <div key={b._id} className="bookmark-card">
                        <h3>
                            <a href={b.url} target="_blank" rel="noreferrer">{b.title}</a>
                        </h3>
                        <p><strong>Category:</strong> {b.category || 'Uncategorized'}</p>
                        <p><strong>Tags:</strong> {b.tags && b.tags.length ? b.tags.join(', ') : 'None'}</p>
                        <p><strong>Description:</strong> {b.description || 'No description provided'}</p>
                        <div className="buttons">
                            <button onClick={() => toggleFavorite(b)} className="edit-btn">
                                {b.isFavorite ? "★ Unfavorite" : "☆ Favorite"}
                            </button>
                            <button onClick={() => setEditingBookmark(b)} className="edit-btn">Edit</button>
                            <button onClick={() => deleteBookmark(b._id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookmarkList;
