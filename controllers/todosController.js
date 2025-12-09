const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/todos.json');

// Чтение данных из файла
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { todos: [] };
  }
};

// Запись данных в файл
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Дни недели
const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

// Контроллеры
const todosController = {
  // Получить все задачи
  getAllTodos: (req, res) => {
    const data = readData();
    const { day, completed } = req.query;
    
    let filteredTodos = data.todos;
    
    // Фильтрация по дню недели
    if (day) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.day.toLowerCase() === day.toLowerCase()
      );
    }
    
    // Фильтрация по статусу выполнения
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      filteredTodos = filteredTodos.filter(todo => todo.completed === isCompleted);
    }
    
    res.json({ todos: filteredTodos });
  },

  // Получить задачи по дню недели
  getTodosByDay: (req, res) => {
    const { day } = req.params;
    const data = readData();
    
    const dayTodos = data.todos.filter(todo => 
      todo.day.toLowerCase() === day.toLowerCase()
    );
    
    if (dayTodos.length === 0) {
      return res.status(404).json({ 
        message: `Задачи на ${day} не найдены` 
      });
    }
    
    res.json({ todos: dayTodos });
  },

  // Получить задачу по ID
  getTodoById: (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const todo = data.todos.find(t => t.id === parseInt(id));
    
    if (!todo) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    res.json({ todo });
  },

  // Создать новую задачу
  createTodo: (req, res) => {
    const { title, description, day, priority = 'medium' } = req.body;
    
    if (!title || !day) {
      return res.status(400).json({ 
        message: 'Название и день недели обязательны' 
      });
    }
    
    if (!daysOfWeek.includes(day.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Неверный день недели. Используйте: понедельник, вторник, среда, четверг, пятница, суббота, воскресенье' 
      });
    }
    
    const data = readData();
    const newTodo = {
      id: data.todos.length > 0 ? Math.max(...data.todos.map(t => t.id)) + 1 : 1,
      title,
      description: description || '',
      day: day.toLowerCase(),
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    data.todos.push(newTodo);
    writeData(data);
    
    res.status(201).json({ todo: newTodo });
  },

  // Обновить задачу
  updateTodo: (req, res) => {
    const { id } = req.params;
    const { title, description, day, priority } = req.body;
    
    const data = readData();
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    if (day && !daysOfWeek.includes(day.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Неверный день недели' 
      });
    }
    
    const updatedTodo = {
      ...data.todos[todoIndex],
      title: title || data.todos[todoIndex].title,
      description: description !== undefined ? description : data.todos[todoIndex].description,
      day: day ? day.toLowerCase() : data.todos[todoIndex].day,
      priority: priority && ['low', 'medium', 'high'].includes(priority) 
        ? priority 
        : data.todos[todoIndex].priority
    };
    
    data.todos[todoIndex] = updatedTodo;
    writeData(data);
    
    res.json({ todo: updatedTodo });
  },

  // Удалить задачу
  deleteTodo: (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    data.todos.splice(todoIndex, 1);
    writeData(data);
    
    res.json({ message: 'Задача удалена' });
  },

  // Переключить статус выполнения задачи
  toggleTodo: (req, res) => {
    const { id } = req.params;
    const data = readData();
    
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(id));
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    data.todos[todoIndex].completed = !data.todos[todoIndex].completed;
    writeData(data);
    
    res.json({ todo: data.todos[todoIndex] });
  }
};

module.exports = todosController;
