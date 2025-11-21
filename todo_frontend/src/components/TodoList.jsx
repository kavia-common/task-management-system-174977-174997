import React from 'react';
import TodoItem from './TodoItem';

/**
 * List of Todo items.
 * Props:
 * - items: array of todos
 * - onToggle: (id, completed) => void
 * - onEdit: (todo) => void
 * - onDelete: (id) => void
 */
// PUBLIC_INTERFACE
export default function TodoList({ items, onToggle, onEdit, onDelete }) {
  /** Renders list of todos with empty state */
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Create your first task using the “Add Task” button.</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {items.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
