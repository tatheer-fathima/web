const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = { id: decoded.id };  // Explicitly assign id
        next();
    } catch (err) {
        console.error("Token error:", err.message);
        res.status(400).json({ error: "Invalid token" });
    }
};
