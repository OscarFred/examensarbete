const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name field is required'],
    },
    googleId: {
      type: Number,
      required: [true, 'Id field is required'],
    },
    picture: {
      type: String
    }
  },
  { timestamps: true },
);

module.exports = model('user', userSchema);
