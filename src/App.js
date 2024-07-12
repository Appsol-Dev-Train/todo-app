import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TodoList from './TodoList';
import CompletedTodos from './CompletedTodos';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo = { text: input, completed: false, dueDate };
      axios.post('http://localhost:5000/todos', newTodo)
        .then(response => setTodos([...todos, response.data]))
        .catch(error => console.error('Error adding todo:', error));
      setInput('');
      setDueDate(null);
    }
  };

  const toggleTodo = (index) => {
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

  const deleteTodo = (index) => {
    const todo = todos[index];
    axios.delete(`http://localhost:5000/todos/${todo.id}`)
      .then(() => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const editTodo = (index, newText, newDueDate) => {
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

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <h2>Task Counter</h2>
          <p>Total Tasks: {todos.length}</p> {/* Counter */}
          <NavLink to="/" exact activeClassName="active" className="nav-link">
            <span>Home</span>
            <span className="counter">{todos.filter(todo => !todo.completed).length}</span>
          </NavLink>
          <NavLink to="/completed" activeClassName="active" className="nav-link">
            <span>Completed Tasks</span>
            <span className="counter">{todos.filter(todo => todo.completed).length}</span>
          </NavLink>
        </div>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>To-Do List</h1>
                  <form onSubmit={addTodo}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Add a new task"
                    />
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      placeholderText="Select due date"
                    />
                    <button type="submit">Add</button>
                  </form>
                  <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
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
