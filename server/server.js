// Importing required modules
const cors = require('cors');
const express = require('express');
const { reset } = require('nodemon');
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
app.use(cors());
app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))


app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));
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

app.get('/', (req, res) => res.send('Example home page!'))
app.get('/failed', (req, res) => res.send('Login failed'))
app.get('/success', isLoggedIn, (req, res) => {
    res.send(`Welcome mr ${req.body.id}`)
})
app.get('/google',
passport.authenticate('google', {
    scope: ['profile']
}));

app.get('/google/callback',
passport.authenticate('google', {
    failureRedirect: '/failed'
}),
function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
});

// Defining route middleware
app.use('/api', require('./routes/api'));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
