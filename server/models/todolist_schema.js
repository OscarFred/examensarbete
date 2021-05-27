const { Schema, model } = require('mongoose');

const TodoItemSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'title field is required'],
    },
    checked: {
      type: Boolean,
    },
  },
  // { timestamps: true },
);


const TodoListSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title field is required'],
    },
    todoItems: {
      type: [TodoItemSchema]
    }
  },
  { timestamps: true },
);

module.exports = model('todoList', TodoListSchema);
