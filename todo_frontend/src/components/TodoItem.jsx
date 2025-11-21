import React from 'react';

/**
 * Single Todo item component.
 * Props:
 * - todo: { id, title, description, completed }
 * - onToggle: (id, completed) => void
 * - onEdit: (todo) => void
 * - onDelete: (id) => void
 */
// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  /** Renders a single todo row/card */
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-left">
        <input
          id={`chk-${todo.id}`}
          type="checkbox"
          checked={Boolean(todo.completed)}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="todo-text">
          <label htmlFor={`chk-${todo.id}`} className="todo-title">{todo.title}</label>
          {todo.description ? <p className="todo-desc">{todo.description}</p> : null}
        </div>
      </div>
      <div className="todo-actions">
        <button className="btn btn-secondary" onClick={() => onEdit(todo)} aria-label={`Edit ${todo.title}`}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>
          Delete
        </button>
      </div>
    </div>
  );
}
