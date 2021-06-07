const express = require('express');
const passport = require('passport');

const {
  readUsers,
} = require('../controllers/user_controller');


const {
  readTeams,
  createTeam,
  inviteToTeam,
  readInvites,
  acceptInvite,
  rejectInvite,
  leaveTeam,
  deleteTeam
} = require('../controllers/team_controller');

const {
  createTodoList,
  createTodoItem,
  updateTodoList,
  updateTodoItem,
  readFavorites,
  readTodoList,
  deleteTodoList,
  deleteTodoItem
} = require('../controllers/todolist_controller');

const router = express.Router();
// .post('/', createData)
// .get('/', readData)
// .put('/:id', updateData)
// .delete('/:id', deleteData)
router
  .post('/createTodoList', createTodoList)
  .put('/updateTodoList/:id', updateTodoList)
  .post('/updateTodoItem/:id', updateTodoItem)
  .get('/readTodoLists/:id/:ownerId', readTodoList)
  .get('/readFavorites/:ownerId', readFavorites)
  .post('/createTodoItem/:id', createTodoItem)
  .post('/deleteTodoList/:id', deleteTodoList)
  .post('/deleteTodoItem/:id', deleteTodoItem)
  .post('/createTeam/', createTeam)
  .get('/readTeams/', readTeams)
  .get('/readUsers', readUsers)
  .post('/inviteToTeam/:id', inviteToTeam)
  .get('/readInvites/', readInvites)
  .get('/acceptInvite/:id', acceptInvite)
  .get('/rejectInvite/:id', rejectInvite)
  .get('/leaveTeam/:id', leaveTeam)
  .get('/deleteTeam/:id', deleteTeam)
  ;
module.exports = router;
