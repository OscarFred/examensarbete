const { Schema, model, mongo } = require('mongoose');

const TeamsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title field is required'],
    },
    users: {
      type: []
    },
    lists: {
      type: []
    }
  },
  { timestamps: true },
);

module.exports = model('teams', TeamsSchema);
