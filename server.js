require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// Mock user data
const users = [
    { id: 1, username: "eagle", password: "password123", role: "user" },
    { id: 2, username: "sheldon", password: "cooper123", role: "admin" }
];

// Store revoked tokens after logout
const tokenBlacklist = []; 

// CheckRole - Middleware
const checkRole = (roles) => (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) return res.status(401).json({ error: "Access denied. No token provided." });

    // Check if the token is blacklisted
    if (tokenBlacklist.includes(token)){
       return res.status(403).json({ error: "Token has been revoked. Please log in again." }); 
    }
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!roles.includes(decoded.role)) {
           return res.status(403).json({ error: "Access forbidden: Insufficient permissions." }); 
        }

        req.user = decoded;
        next();
    } catch(error){
       res.status(400).json({ error: "Invalid or expired token." });
    }
};

// Login Route
app.post("/login", (req, res) => {
    try{
      const { username, password } = req.body;
      const user = users.find(u => u.username === username && u.password === password);
      if(!user) return res.status(401).json({ error: "Invalid credentials!" });

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.status(200).json({ message: "Login successful", token });
    } catch(error) {
       res.status(500).json({ error: error.message });
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    try{
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if(!token) return res.status(400).json({ error: "Token required for logout." });  
      
      // Add the token to the blacklist
      tokenBlacklist.push(token);
      console.log(token);
      res.status(200).json({ message: "Logged out successfully. Token revoked." });
    } catch(error){
       res.status(500).json({ error: error.message }); 
    }
});

// Admin Route - Only accessible to admin
app.get("/admin", checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!", user: req.user });
});

// User Route - Accessible to both user and admin
app.get("/user", checkRole(['admin', 'user']), (req, res) => {
  res.status(200).json({ message: "Welcome, User!", user: req.user });
});

// Public Route - No Authentication required
app.get("/public", (req, res) => {
  res.status(200).json({ message: "This is a public route available to everyone." });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});