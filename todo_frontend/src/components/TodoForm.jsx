import React, { useEffect, useState } from 'react';

/**
 * Form for creating or editing a Todo item.
 * Props:
 * - initialData?: { title, description }
 * - onSubmit: (data) => void
 * - onCancel: () => void
 */
// PUBLIC_INTERFACE
export default function TodoForm({ initialData = null, onSubmit, onCancel }) {
  /** Todo create/edit form */
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="alert error" role="alert">{error}</div>}
      <div className="form-field">
        <label htmlFor="todo-title">Title</label>
        <input
          id="todo-title"
          type="text"
          placeholder="e.g., Buy groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
      </div>
      <div className="form-field">
        <label htmlFor="todo-desc">Description</label>
        <textarea
          id="todo-desc"
          placeholder="Optional details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          rows={3}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Add Task'}</button>
      </div>
    </form>
  );
}
