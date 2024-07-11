import React from 'react';
import TodoItem from './TodoItem';

function CompletedTodos({ todos }) {
  return (
    <div>
      <h1>Completed Tasks</h1>
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