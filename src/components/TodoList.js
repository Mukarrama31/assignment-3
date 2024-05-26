import React from 'react';
import TodoItem from './TodoItem';
import '../styles/TodoList.css'; 

const TodoList = ({ todos, dispatch, handleEditModalOpen }) => {
    return (
        <div className="todo-list">
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} dispatch={dispatch} handleEditModalOpen={handleEditModalOpen} />
            ))}
        </div>
    );
};

export default TodoList;
