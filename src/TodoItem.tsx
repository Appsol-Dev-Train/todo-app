import React, { useState, KeyboardEvent } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  index?: number;
  toggleTodo: () => void;
  deleteTodo: () => void;
  editTodo: (index: number, newText: string, newDueDate: Date | null) => void;
  disableActions?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index, toggleTodo, deleteTodo, editTodo, disableActions }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(todo.text);
  const [newDueDate, setNewDueDate] = useState<Date | null>(todo.dueDate);

  const handleEdit = () => {
    if (isEditing && newText.trim() && index !== undefined) {
      editTodo(index, newText, newDueDate);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
            className="p-2 text-base text-black border border-gray-300 rounded"
          />
          <DatePicker
            selected={newDueDate}
            onChange={(date: Date | null) => setNewDueDate(date)}
            placeholderText="Select due date"
            disabled={todo.completed}
            className="p-2 text-base text-black border border-gray-300 rounded"
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
      {!disableActions && (
        <div className="todo-buttons flex gap-4 items-center">
          {!todo.completed && (
            <button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
              Edit
            </button>
          )}
          <button onClick={deleteTodo} className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;
