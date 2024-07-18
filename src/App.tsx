import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TodoList from './TodoList';
import CompletedTodos from './CompletedTodos';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo: Omit<Todo, 'id'> = { text: input, completed: false, dueDate, createdAt: new Date() };
      axios.post('http://localhost:5000/todos', newTodo)
        .then(response => setTodos([...todos, response.data]))
        .catch(error => console.error('Error adding todo:', error));
      setInput('');
      setDueDate(null);
    }
  };

  const toggleTodo = (index: number) => {
    const todo = todos[index];
    const updatedTodo = { ...todo, completed: !todo.completed };
    axios.put(`http://localhost:5000/todos/${todo.id}`, updatedTodo)
      .then(response => {
        const newTodos = [...todos];
        newTodos[index] = response.data;
        setTodos(newTodos);
      })
      .catch(error => console.error('Error toggling todo:', error));
  };

  const deleteTodo = (index: number) => {
    const todo = todos[index];
    axios.delete(`http://localhost:5000/todos/${todo.id}`)
      .then(() => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const editTodo = (index: number, newText: string, newDueDate: Date | null) => {
    const todo = todos[index];
    const updatedTodo = { ...todo, text: newText, dueDate: newDueDate };
    axios.put(`http://localhost:5000/todos/${todo.id}`, updatedTodo)
      .then(response => {
        const newTodos = [...todos];
        newTodos[index] = response.data;
        setTodos(newTodos);
      })
      .catch(error => console.error('Error editing todo:', error));
  };

  const categorizeTasks = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayTasks: Todo[] = [];
    const previousTasks: Todo[] = [];

    todos.forEach(todo => {
      const todoDate = new Date(todo.createdAt).setHours(0, 0, 0, 0);
      if (todoDate === today) {
        todayTasks.push(todo);
      } else {
        previousTasks.push(todo);
      }
    });

    return { todayTasks, previousTasks };
  };

  const { todayTasks, previousTasks } = categorizeTasks();

  return (
    <Router>
      <div className="flex h-screen font-sans text-white">
        <div className="w-64 h-full bg-gray-900 pt-5 flex flex-col items-center fixed top-0 left-0">
          <h1 className="m-0 p-2 text-3xl text-white">Todo-List</h1>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'p-4 text-white text-left w-[230px] flex items-center bg-gray-700' : 'p-4 text-white text-left w-[230px] flex items-center hover:bg-gray-700')}
          >
            <span>Tasks</span>
            <span className="bg-blue-600 rounded-full px-2 py-1 ml-auto">{todos.filter(todo => !todo.completed).length}</span>
          </NavLink>
          <NavLink
            to="/completed"
            className={({ isActive }) => (isActive ? 'p-4 text-white text-left w-[230px] flex items-center bg-gray-700' : 'p-4 text-white text-left w-[230px] flex items-center hover:bg-gray-700')}
          >
            <span>Completed Tasks</span>
            <span className="bg-blue-600 rounded-full px-2 py-1 ml-auto">{todos.filter(todo => todo.completed).length}</span>
          </NavLink>
        </div>

        <div className="ml-64 flex-grow bg-cover bg-no-repeat" style={{ backgroundImage: "url('/background.jpg')" }}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1 className="text-3xl pt-3 pl-3 mb-4 text-black">Todo's</h1>
                  <form onSubmit={addTodo} className="mb-5 flex">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Add a new task"
                      className="p-2 w-3/5 text-lg text-black border border-gray-300 rounded"
                    />
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      placeholderText="Select due date"
                      className="p-2 text-lg text-black border border-gray-300 rounded ml-2"
                    />
                    <button type="submit" className="p-2 text-lg ml-2 cursor-pointer bg-blue-600 text-white rounded">Add</button>
                  </form>

                  <h2 className="text-2xl mb-4 pl-3 text-black">My Day</h2>
                  <TodoList todos={todayTasks} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />

                  <h2 className="text-2xl mt-6 mb-4 pl-3 text-black">Previous Tasks</h2>
                  <TodoList todos={previousTasks} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
                </div>
              }
            />
            <Route
              path="/completed"
              element={<CompletedTodos todos={todos.filter(todo => todo.completed)} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
