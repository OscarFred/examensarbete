const express = require('express');
const passport = require('passport');

const {
  google,
  readData,
  updateData,
  // deleteData,
} = require('../controllers/user_controller');

const {
  createTodoList,
  readTodoList,
  createTodoItem,
  updateTodoItem,

} = require('../controllers/todolist_controller');

const router = express.Router();
// .post('/', createData)
// .get('/', readData)
// .put('/:id', updateData)
// .delete('/:id', deleteData)
router
  .post('/createTodoList', createTodoList)
  .get('/readTodoLists', readTodoList)
  .post('/createTodoItem/:id', createTodoItem)
  .post('/updateTodoItem/:id', updateTodoItem);
module.exports = router;
