// 'use strict';

// const passport = require('passport');
// const User = require('../models/user_schema');

// const google = () => {passport.authenticate("google", {
//     scope: ['profile'],
//     prompt : "select_account" // Added here
// })
// }

// const check = (req, res) => {
//     console.log("user - " + req.user);
//     console.log(req.session.passport);
//     if (req.user === undefined) {
//         res.json({});
//     } else {
//         res.json({
//         user: req.user
//         });
//     }
// }

// const logOut = function(req, res, next) {
//     req.logout();
//     res.json({ msg: "Logged out" });
//   }

// const callback = () => {
//     passport.authenticate('google', {
//         failureRedirect: '/failed'
//     }),
//     function (req, res) {
//         res.redirect('http://localhost:3002');
//     }
// };

// const readData = (req, res) => {
//   User.find()
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json(err);
//     });
// };

// const updateData = (req, res) => {
//   User.findByIdAndUpdate(req.params.id, req.body, {
//     useFindAndModify: false,
//     new: true,
//   })
//     .then((data) => {
//       console.log('User updated!');
//       res.status(201).json(data);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         console.error('Error Validating!', err);
//         res.status(422).json(err);
//       } else {
//         console.error(err);
//         res.status(500).json(err);
//       }
//     });
// };

// const deleteData = (req, res) => {
//   User.findById(req.params.id)
//     .then((data) => {
//       if (!data) {
//         throw new Error('User not available');
//       }
//       return data.remove();
//     })
//     .then((data) => {
//       console.log('User removed!');
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json(err);
//     });
// };

// module.exports = {
//     google,
//     check,
//     logOut,
//     callback
// };
