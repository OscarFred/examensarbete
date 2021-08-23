// Importing required modules
const cors = require('cors');
const express = require('express');
// const { reset } = require('nodemon');
const path = require('path')
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

// parse env variables
require('dotenv').config();

require("./helpers/db/mongodb.js")();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
// app.use(cors());
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    
   };
app.use(cors(corsOption));

app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))


app.set('trust proxy', 1)

app.set('view engine', 'html');

// Static folder
app.use(express.static(path.join(__dirname + '/views/')));
// google ouath
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}


app.use(passport.initialize());
app.use(passport.session());

// Defining route middleware
app.use('/auth', require('./routes/auth'));
app.use('/api', isLoggedIn, require('./routes/api'));

// Listening to port
app.listen(port);
console.log(`Listening On ${process.env.CALLBACK_URL} http://localhost:${port}/api`);

module.exports = app;
