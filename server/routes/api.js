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
  updateTodoList,
  readFavorites,
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
  .put('/updateTodoList/:id', updateTodoList)
  .get('/readTodoLists/:id', readTodoList)
  .get('/readFavorites', readFavorites)
  .post('/createTodoItem/:id', createTodoItem)
  .post('/updateTodoItem/:id', updateTodoItem);
module.exports = router;
