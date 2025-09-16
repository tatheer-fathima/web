const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: "Uncategorized" },
    tags: [{ type: String }],
    description: { type: String },            // New field
    isFavorite: { type: Boolean, default: false }, // New field
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }); // Automatically add createdAt and updatedAt

module.exports = mongoose.model('Bookmark', bookmarkSchema);
