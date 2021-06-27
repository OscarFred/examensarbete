const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user_schema');



passport.serializeUser((user, done) => {
  done(null, user.id);
});

  
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: "926562963050-voi9des2np17g8pi66bdvsd4rmj069nt.apps.googleusercontent.com",
    clientSecret: "daHVph46UnFTPoLOzYiJqBww",
    callbackURL: "http://checkbx.herokuapp.com/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Callback method triggered upon signing in.
    User.findOne({ googleId: profile.id }).then(currentUser => {
      if (currentUser) {
        // already have this user
        done(null, currentUser);
      } else {
        // if not, create user in our db
        new User({
          googleId: profile.id,
          displayName: profile.displayName,
          picture: profile._json.picture
        })
          .save()
          .then(newUser => {
            done(null, newUser);
          });
      }
    });



  // function(accessToken, refreshToken, profile, done) {
  //   // console.log(`passport.use in passport.js: ${profile}`)
  //   // use the profile info (mainly profile id) to check if the user i registered in db
  //   console.log(profile)
  //   User.updateOne({"googleId": profile.id}, {$set: {googleId: profile.id, displayName: profile.displayName, picture: profile._json.picture}}, {upsert: true})
  //   .then((data) => {

  //     });
  //   return done(null, profile);
  // }
  }
));