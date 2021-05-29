'use strict';
var ObjectID = require('mongodb').ObjectID
const TodoList = require('../models/todolist_schema');

const createTodoList = (req, res) => {
  console.log("Testing" + req.body.owner)
  TodoList.create(req.body)
    .then((data) => {
      console.log('New TodoList Created!', data);
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

const createTodoItem = (req, res) => {
  TodoList.findByIdAndUpdate(req.params.id, {$push: {"todoItems": req.body}})
  .then((data) => {
    console.log('Todoitem created!');
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

const updateTodoItem = (req, res) => {
  TodoList.updateOne({"_id": ObjectID(req.params.id), "todoItems._id": ObjectID(req.body.id)}, {$set: {"todoItems.$": req.body}})
  .then((data) => {
    console.log('Todo item updated!');
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

const readTodoList = (req, res) => {
  TodoList.find({ownerId: req.user._id}).sort({createdAt: -1})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTodoList,
  readTodoList,
  createTodoItem,
  updateTodoItem,
};
