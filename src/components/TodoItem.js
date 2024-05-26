import React from 'react';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/TodoItem.css';

const formatDateTime = (dateTime) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Date(dateTime).toLocaleString('en-US', options);
    let formattedDateSentenceCase = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    formattedDateSentenceCase = formattedDateSentenceCase.replace('AM', 'a.m.');
    formattedDateSentenceCase = formattedDateSentenceCase.replace('PM', 'p.m.');
    return formattedDateSentenceCase.replace(',', '');
};

const TodoItem = ({ todo, dispatch, handleEditModalOpen }) => {
    const deleteTodo = () => {
        dispatch({ type: 'DELETE_TODO', payload: todo.id });
    };

    const toggleComplete = () => {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: todo.id });
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <p className="task-text">{todo.text}</p>
            <p className="deadline-text">{formatDateTime(todo.deadline)}</p>
            <div className="todo-buttons">
                <button className="icon-button" onClick={toggleComplete}><FaCheck /></button>
                <button className="icon-button" onClick={() => handleEditModalOpen(todo)}><FaEdit /></button>
                <button className="icon-button" onClick={deleteTodo}><FaTrash /></button>
            </div>
        </div>
    );
};

export default TodoItem;
