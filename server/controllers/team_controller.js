'use strict';
var ObjectID = require('mongodb').ObjectID
const Team = require('../models/team_schema');

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

const readTeams = (req, res) => {
  Team.find({members: {$elemMatch: {_id: req.user._id}}}).sort({createdAt: -1})
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });  
};


const inviteToTeam = (req, res) => {
  Team.updateOne({_id: new ObjectID(req.params.id)}, {$addToSet: {invited: {$each: req.body.inviteUsers}}}, {upsert: true})
  .then((data) => {
    console.log('User invited!');
    console.log(data)
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
}

const readInvites = (req, res) => {
  Team.find({invited: {$elemMatch: {_id: req.user._id}}})
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });  
};

const acceptInvite = (req, res) => {
  console.log(req.user.picture)
  Team.findOne({_id: ObjectID(req.params.id), invited: {$elemMatch: {_id: req.user._id}}})
  .then((data) => {
    Team.updateOne({_id: new ObjectID(req.params.id)}, {$addToSet: {members: {_id: req.user._id, displayName: req.user.displayName, picture: req.user.picutre}}}, {upsert: true})
    .then((data) => {
      Team.updateOne({_id: ObjectID(req.params.id)}, {$pull: {invited: {_id: ObjectID(req.user._id)}}}, { safe: true, upsert: true })
      .then((data) => {
        res.status(201).json(data);
      })
    })
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
}

const rejectInvite = (req, res) => {
  Team.findOne({_id: ObjectID(req.params.id), invited: {$elemMatch: {_id: req.user._id}}})
  Team.updateOne({_id: ObjectID(req.params.id)}, {$pull: {invited: {_id: ObjectID(req.user._id)}}}, { safe: true, upsert: true })
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
}

const leaveTeam = (req, res) => {
  Team.updateOne({_id: ObjectID(req.params.id), ownerId: { $ne: req.user._id }}, {$pull: {members: {_id: ObjectID(req.user._id)}}}, { safe: true, upsert: true })
  .then((data => {
    res.status(200).json(data);
  }))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
}

const removeFromTeam = (req, res) => {
  Team.updateOne({_id: ObjectID(req.params.teamId), ownerId: req.user._id }, {$pull: {members: {_id: ObjectID(req.params.userId)}}}, { safe: true, upsert: true })
  .then((data => {
    res.status(200).json(data);
  }))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
}

const updateTeam = (req, res) => {
  Team.updateOne({"_id": ObjectID(req.params.id)}, {$set: {"teamName": req.body.teamName, "teamDescription": req.body.teamDescription}})
  .then((data) => {
    console.log('Team updated!');
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
}

const deleteTeam = (req, res) => {
  Team.deleteOne({_id: ObjectID(req.params.id), ownerId: ObjectID(req.user._id)})
  .then((data => {
    res.status(200).json(data);
  }))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  })
}
module.exports = {
  readTeams,
  createTeam,
  inviteToTeam,
  readInvites,
  acceptInvite,
  rejectInvite,
  leaveTeam,
  deleteTeam,
  removeFromTeam,
  updateTeam
};
