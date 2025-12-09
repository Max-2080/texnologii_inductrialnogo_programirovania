const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController');

// GET все задачи
router.get('/', todosController.getAllTodos);

// GET задачи по дню недели
router.get('/day/:day', todosController.getTodosByDay);

// GET задачи по ID
router.get('/:id', todosController.getTodoById);

// POST создать новую задачу
router.post('/', todosController.createTodo);

// PUT обновить задачу
router.put('/:id', todosController.updateTodo);

// DELETE удалить задачу
router.delete('/:id', todosController.deleteTodo);

// PUT отметить задачу как выполненную
router.put('/:id/toggle', todosController.toggleTodo);

module.exports = router;
