import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
}

interface CompletedTodosProps {
  todos: Todo[];
}

const CompletedTodos: React.FC<CompletedTodosProps> = ({ todos }) => {
  return (
    <div>
      <h1 className="text-3xl pt-3 pl-3 mb-4 text-black">Completed</h1>
      {todos.length === 0 ? (
        <p>No completed tasks</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={() => { } }
              deleteTodo={() => { } }
              editTodo={() => { } }
              disableActions={true}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default CompletedTodos;
