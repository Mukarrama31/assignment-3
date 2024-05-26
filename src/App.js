import React, { useReducer, useEffect } from 'react';
import TodoList from './components/TodoList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const initialState = {
    todos: [],
    newTodoText: '',
    selectedDeadline: null,
    addModalIsOpen: false,
    editModalIsOpen: false,
    editTodo: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_NEW_TODO_TEXT':
            return { ...state, newTodoText: action.payload };
        case 'SET_SELECTED_DEADLINE':
            return { ...state, selectedDeadline: action.payload };
        case 'OPEN_ADD_MODAL':
            return { ...state, addModalIsOpen: true };
        case 'CLOSE_ADD_MODAL':
            return { ...state, addModalIsOpen: false };
        case 'OPEN_EDIT_MODAL':
            return {
                ...state,
                editModalIsOpen: true,
                editTodo: action.payload,
                newTodoText: action.payload.text,
                selectedDeadline: new Date(action.payload.deadline)
            };
        case 'CLOSE_EDIT_MODAL':
            return { ...state, editModalIsOpen: false, editTodo: null, newTodoText: '', selectedDeadline: null };
        case 'ADD_TODO':
            if (state.newTodoText.trim() !== '' && state.selectedDeadline) {
                const newTodo = {
                    id: Date.now(),
                    text: state.newTodoText,
                    deadline: state.selectedDeadline,
                    completed: false
                };
                const updatedTodos = [...state.todos, newTodo];
                localStorage.setItem('todos', JSON.stringify(updatedTodos));
                return {
                    ...state,
                    todos: updatedTodos,
                    newTodoText: '',
                    selectedDeadline: null,
                    addModalIsOpen: false,
                };
            }
            return state;
        case 'TOGGLE_COMPLETE':
            const toggledTodos = state.todos.map(todo =>
                todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
            );
            localStorage.setItem('todos', JSON.stringify(toggledTodos));
            return {
                ...state,
                todos: toggledTodos
            };
        case 'DELETE_TODO':
            const updatedTodos = state.todos.filter(todo => todo.id !== action.payload);
            localStorage.setItem('todos', JSON.stringify(updatedTodos));
            return {
                ...state,
                todos: updatedTodos
            };
        case 'CONFIRM_EDIT':
            const editedTodos = state.todos.map(todo =>
                todo.id === state.editTodo.id ? { ...todo, text: state.newTodoText, deadline: state.selectedDeadline } : todo
            );
            localStorage.setItem('todos', JSON.stringify(editedTodos));
            return {
                ...state,
                todos: editedTodos,
                newTodoText: '',
                selectedDeadline: null,
                editModalIsOpen: false,
                editTodo: null
            };
        case 'LOAD_STATE':
            return action.payload;
        default:
            return state;
    }
};

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos'));
        if (storedTodos) {
            dispatch({ type: 'LOAD_STATE', payload: { todos: storedTodos } });
        }
    }, []);

    const handleAddTodo = () => {
        dispatch({ type: 'ADD_TODO' });
    };

    const handleConfirmEdit = () => {
        dispatch({ type: 'CONFIRM_EDIT' });
    };

    const handleAddModalOpen = () => {
        if (state.newTodoText.trim() !== '') {
            dispatch({ type: 'OPEN_ADD_MODAL' });
        }
    };

    const handleEditModalOpen = (todo) => {
        dispatch({ type: 'OPEN_EDIT_MODAL', payload: todo });
    };

    return (
        <div className="app">
            <h1>Task Tracker</h1>
            <div className="entry-box">
                <input
                    type="text"
                    placeholder="New Task"
                    value={state.newTodoText}
                    onChange={(event) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: event.target.value })}
                    className="task-input"
                />
                <button onClick={handleAddModalOpen} className="add-button">Add</button>
            </div>
            {state.addModalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <input
                            type="text"
                            placeholder="New Task"
                            value={state.newTodoText}
                            onChange={(event) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: event.target.value })}
                            className="task-input"
                        />
                        <DatePicker
                            selected={state.selectedDeadline}
                            onChange={(date) => dispatch({ type: 'SET_SELECTED_DEADLINE', payload: date })}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy hh:mm aa"
                            placeholderText="Select Deadline"
                            className="deadline-picker"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAddTodo}>Confirm</button>
                            <button onClick={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {state.editModalIsOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <input
                            type="text"
                            value={state.newTodoText}
                            onChange={(event) => dispatch({ type: 'SET_NEW_TODO_TEXT', payload: event.target.value })}
                            className="task-input"
                        />
                        <DatePicker
                            selected={state.selectedDeadline}
                            onChange={(date) => dispatch({ type: 'SET_SELECTED_DEADLINE', payload: date })}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy hh:mm aa"
                            placeholderText="Select Deadline"
                            className="deadline-picker"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleConfirmEdit}>Confirm Edit</button>
                            <button onClick={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <TodoList todos={state.todos} dispatch={dispatch} handleEditModalOpen={handleEditModalOpen} />
        </div>
    );
};

export default App;
