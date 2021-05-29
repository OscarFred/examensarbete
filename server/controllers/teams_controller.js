'use strict';
var ObjectID = require('mongodb').ObjectID
const Team = require('../models/teams_schema');

const createTeam = (req, res) => {
  Team.create(req.body)
    .then((data) => {
      console.log('New Team Created!', data);
      res.status(201).json(data);
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
};

module.exports = {
    createTeam,
    createList,
    updateTeam
};
