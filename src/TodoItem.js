import React, { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function TodoItem({ todo, index, toggleTodo, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate);

  const handleEdit = () => {
    if (isEditing && newText.trim()) {
      editTodo(index, newText, newDueDate);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <li>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            disabled={todo.completed}
          />
          <DatePicker
            selected={newDueDate}
            onChange={(date) => setNewDueDate(date)}
            placeholderText="Select due date"
            disabled={todo.completed}
          />
          <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
        </div>
      ) : (
        <span
          style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}
          onClick={toggleTodo}
        >
          {todo.text} {todo.dueDate && <span> - Due: {format(todo.dueDate, 'MM/dd/yyyy')}</span>}
        </span>
      )}
      <div className="todo-buttons">
        {!todo.completed && (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button onClick={() => deleteTodo(index)}>Delete</button>
      </div>
    </li>
  );
}

export default TodoItem;
