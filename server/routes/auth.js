const express = require('express');
const passport = require('passport');

const {

} = require('../controllers/user_controller');


const router = express.Router();

router
  .get("/google", passport.authenticate("google", {
    scope: ['profile'],
    prompt : "select_account" // Added here
}))
  .get("/check", (req, res) => {
    if (req.user === undefined) {
      res.json({});
    } else {
      res.json({
        user: req.user
      });
    }
  })
  .get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('http://localhost:3002');

    res.json({ msg: "Logged out" });
  })
  .get('/google/callback',
  passport.authenticate('google', {
      failureRedirect: '/failed'
  }),
  function (req, res) {
      res.redirect('http://localhost:3002');
  });
module.exports = router;
