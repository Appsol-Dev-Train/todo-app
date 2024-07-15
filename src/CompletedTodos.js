import React from 'react';
import TodoItem from './TodoItem';

function CompletedTodos({ todos }) {
  return (
    <div>
      <h1 className="text-3xl pt-3 pl-3 mb-4 text-black">Completed</h1>
      {todos.length === 0 ? (
        <p>No completed tasks</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <TodoItem
              key={index}
              todo={todo}
              toggleTodo={() => {}}
              deleteTodo={() => {}}
              disableActions={true}/>
          ))}
        </ul>)}
    </div>
  );
}

export default CompletedTodos;