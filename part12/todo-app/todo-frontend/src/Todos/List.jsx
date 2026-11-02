import React from "react";
import Todo from "./Todo";
const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <div>
      {todos
        .map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            completeTodo={completeTodo}
          />
        ))
        .reduce((acc, cur) => [...acc, <hr />, cur], [])}
    </div>
  );
};

export default TodoList;
