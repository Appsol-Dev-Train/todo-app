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
    <li className="flex justify-between items-center p-2 border-b border-gray-300 bg-opacity-60 bg-black mb-4 rounded">
      {isEditing ? (
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            disabled={todo.completed}
            className="p-2 text-base border border-gray-300 rounded"
          />
          <DatePicker
            selected={newDueDate}
            onChange={(date) => setNewDueDate(date)}
            placeholderText="Select due date"
            disabled={todo.completed}
            className="p-2 text-base border border-gray-300 rounded"
          />
          <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4" onClick={toggleTodo} style={{ textDecoration: todo.completed ? 'line-through' : 'none', cursor: 'pointer' }}>
          <span>{todo.text}</span>
          {todo.dueDate && <span>- Due: {format(todo.dueDate, 'MM/dd/yyyy')}</span>}
        </div>
      )}
      <div className="todo-buttons flex gap-4 items-center">
        {!todo.completed && (
          <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
            Edit
          </button>
        )}
        <button onClick={() => deleteTodo(index)} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;