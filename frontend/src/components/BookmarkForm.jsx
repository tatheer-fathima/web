import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookmarkForm = ({ token, fetchBookmarks, editingBookmark, setEditingBookmark }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setTitle(editingBookmark?.title || '');
        setUrl(editingBookmark?.url || '');
        setCategory(editingBookmark?.category || '');
        setTags(editingBookmark?.tags?.join(',') || '');
        setDescription(editingBookmark?.description || '');
    }, [editingBookmark]);

    const submitBookmark = async () => {
        const bookmarkData = {
            title,
            url,
            category,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            description
        };

        try {
            if (editingBookmark) {
                console.log("Editing Bookmark ID:", editingBookmark._id); // Debugging line
                await axios.put(`http://localhost:5000/api/bookmarks/${editingBookmark._id}`, 
                    bookmarkData, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEditingBookmark(null);
            } else {
                await axios.post('http://localhost:5000/api/bookmarks', 
                    bookmarkData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            setTitle('');
            setUrl('');
            setCategory('');
            setTags('');
            setDescription('');
            fetchBookmarks();
        } catch (err) {
            console.error("Error saving bookmark:", err);
            alert("Error saving bookmark");
        }
    };

    return (
        <div>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={submitBookmark}>{editingBookmark ? "Update" : "Add"} Bookmark</button>
            {editingBookmark && <button onClick={() => setEditingBookmark(null)}>Cancel</button>}
        </div>
    );
};

export default BookmarkForm;
