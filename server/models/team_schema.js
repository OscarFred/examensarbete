const { Schema, model, mongo } = require('mongoose');

const userReference = new Schema(
  {
    _id: {
      type: mongo.ObjectID,
      required: [true, 'UserId field is required'],
    },
    displayName: {
      type: String,
    },
    picture: {
      type: String
    },
  }
);

const TeamSchema = new Schema(
  {
    teamName: {
      type: String,
      required: [true, 'title field is required'],
    },
    teamDescription: {
      type: String
    },
    ownerId: {
      type: mongo.ObjectID,
      required: [true, 'team must have an owner']
    },
    members: {
      type:  [userReference]
    },
    color: {
      type: String
    },
    invited: {
      type: [userReference]
    }
  },
  { timestamps: true },
);

module.exports = model('team', TeamSchema);
