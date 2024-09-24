const fs = require('fs');
const path = require('path');

// Path to JSON file
const filePath = path.join(__dirname, 'tasks.json');

// Initialize file if it doesn't exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Helper to read tasks from JSON
const getTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Helper to write tasks to JSON
const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Add task
const addTask = (description) => {
  const tasks = getTasks();
  const newTask = {
    id: tasks.length + 1,
    description,
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added successfully (ID: ${newTask.id})`);
};

// Update task
const updateTask = (id, description) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.description = description;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} updated successfully`);
  } else {
    console.log(`Task ${id} not found`);
  }
};

// Delete task
const deleteTask = (id) => {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== parseInt(id));
  saveTasks(tasks);
  console.log(`Task ${id} deleted successfully`);
};

// Mark task status
const markTaskStatus = (id, status) => {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.status = status;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as ${status}`);
  } else {
    console.log(`Task ${id} not found`);
  }
};

// List tasks
const listTasks = (status) => {
  const tasks = getTasks();
  let filteredTasks = tasks;

  if (status) {
    filteredTasks = tasks.filter(t => t.status === status);
  }

  if (filteredTasks.length === 0) {
    console.log('No tasks found');
  } else {
    filteredTasks.forEach(t => {
      console.log(`ID: ${t.id}, Description: ${t.description}, Status: ${t.status}, Created At: ${t.createdAt}`);
    });
  }
};

// Command handler
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    addTask(args[1]);
    break;
  case 'update':
    updateTask(args[1], args[2]);
    break;
  case 'delete':
    deleteTask(args[1]);
    break;
  case 'mark-in-progress':
    markTaskStatus(args[1], 'in-progress');
    break;
  case 'mark-done':
    markTaskStatus(args[1], 'done');
    break;
  case 'list':
    listTasks(args[1]);
    break;
  default:
    console.log('Unknown command');
    break;
}
