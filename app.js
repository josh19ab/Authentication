require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// Database connection
connection();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Main page route
app.get("/", (req, res) => {
    res.render("login", { message: null });
});

// Registration page route
app.get("/register", (req, res) => {
    res.render("register", { message: null });
});

// Protected home page route
app.get("/home", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/");
    }
    try {
        const user = jwt.verify(token, process.env.JWTPRIVATEKEY);
        res.render("home", { user });
    } catch (error) {
        res.clearCookie("token");
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
