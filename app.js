require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database-connection');
const indexRouter = require('./routes/index-router');
const homeRouter = require('./routes/home-router');
const dashboardRouter = require('./routes/dashboard-router');
const app = express();

// Important Middlewares : 
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));  
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// Connection to MongoDB :
connectDB();

// Redirection to indexRoute
app.use("/", indexRouter);
app.use("/home", homeRouter);
app.use("/dashboard", dashboardRouter);

// Running application on Port : 
app.listen(process.env.PORT || 3000);