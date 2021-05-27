const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user_schema');



passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.find({"googleId": id}, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: "926562963050-voi9des2np17g8pi66bdvsd4rmj069nt.apps.googleusercontent.com",
    clientSecret: "daHVph46UnFTPoLOzYiJqBww",
    callbackURL: "http://localhost:9000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken)
    console.log(refreshToken)
    // use the profile info (mainly profile id) to check if the user i registered in db
    User.updateOne({"googleId": profile.id}, {$set: {googleId: profile.id, name: profile.displayName, picture: profile._json.picture}}, {upsert: true})
    .then((data) => {
        console.log('Todoitem created!');
        return status(201).json(data);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          console.error('Error Validating!', err);
          res.status(422).json(err);
        } else {
          console.error(err);
          res.status(500).json(err);
        }
      });
    return cb(null, profile);
  }
));