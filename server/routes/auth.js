const express = require('express');
const passport = require('passport');
require('dotenv').config()

const {

} = require('../controllers/user_controller');


const router = express.Router();

router
  .get("/google", passport.authenticate("google", {
    scope: ['profile'],
    prompt : "select_account" // Added here
}))
  .get("/check", (req, res) => {
    console.log('check')
    if (req.user === undefined) {
      res.json({});
    } else {
      res.json({
        user: req.user
      });
    }
  })
  .get('/logout', function(req, res, next) {
    console.log('logout')

    req.logout();
    res.redirect(`${process.env.REDIRECT_URL}`);

    res.json({ msg: "Logged out" });
  })
  .get('/google/callback',
  passport.authenticate('google', {
      failureRedirect: '/failed'
  }),
  function (req, res) {
      console.log(process.env.REDIRECT_URL)
      res.redirect(`${process.env.REDIRECT_URL}`);
  });
module.exports = router;
