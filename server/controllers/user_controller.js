'use strict';
var ObjectID = require('mongodb').ObjectID
const User = require('../models/user_schema');


const readUsers = (req, res) => {
  User.find()
  .then((data) => {
    let userReference = []
    data.forEach(user => {
      userReference.push({_id: user._id, displayName: user.displayName, picture: user.picture, selected: false})
    });
    res.status(200).json(userReference);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });  
};

module.exports = {
  readUsers,
};
