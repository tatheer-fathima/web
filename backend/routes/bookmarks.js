const express = require('express');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

const router = express.Router();

// Add a bookmark
router.post('/', auth, async (req, res) => {
    const { title, url, category, tags } = req.body;

    // Validate required fields
    if (!title || !url) return res.status(400).json({ error: "Title and URL are required" });

    try {
        const bookmark = new Bookmark({
            title,
            url,
            category: category || "Uncategorized",
            tags: tags || [],
            user: req.user.id
        });
        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (err) {
        console.error("Error adding bookmark:", err.message);
        res.status(500).json({ error: "Could not add bookmark" });
    }
});

// Get all bookmarks with optional search & category filter
router.get('/', auth, async (req, res) => {
  const { search, category } = req.query;
  let filter = { user: req.user.id };

  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category) filter.category = category;

  try {
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json(bookmarks || []);
  } catch (err) {
    console.error("Error fetching bookmarks:", err.message);
    res.status(500).json({ error: "Could not fetch bookmarks" });
  }
});

// Update a bookmark
router.put('/:id', auth, async (req, res) => {
    const { title, url, category, tags, description, isFavorite } = req.body;

    try {
        const bookmark = await Bookmark.findById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
        if (bookmark.user.toString() !== req.user.id)
            return res.status(401).json({ error: "Unauthorized" });

        bookmark.title = title || bookmark.title;
        bookmark.url = url || bookmark.url;
        bookmark.category = category || bookmark.category;
        bookmark.tags = tags || bookmark.tags;
        bookmark.description = description || bookmark.description;
        bookmark.isFavorite = isFavorite !== undefined ? isFavorite : bookmark.isFavorite;

        await bookmark.save();
        res.json(bookmark);
    } catch (err) {
        console.error("Error updating bookmark:", err.message);
        res.status(500).json({ error: "Could not update bookmark" });
    }
});


// Delete a bookmark
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Bookmark.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Bookmark not found" });
        res.json({ message: "Bookmark deleted" });
    } catch (err) {
        console.error("Error deleting bookmark:", err.message);
        res.status(500).json({ error: "Could not delete bookmark" });
    }
});

module.exports = router;
