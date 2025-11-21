import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { getTodos, createTodo, updateTodo, deleteTodo, toggleComplete } from './api';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Modal from './components/Modal';

// PUBLIC_INTERFACE
function App() {
  /** Main ToDo application with Ocean Professional styling */
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // todo being edited
  const [busyIds, setBusyIds] = useState(new Set()); // for per-item spinners

  // Apply theme attribute for CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch todos on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTodos()
      .then((data) => {
        if (!cancelled) {
          setTodos(Array.isArray(data) ? data : (data?.items || []));
          setErr('');
        }
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || 'Failed to load todos');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (todo) => {
    setEditing(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (data) => {
    try {
      setErr('');
      if (editing) {
        const updated = await updateTodo(editing.id, data);
        setTodos((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
      } else {
        const created = await createTodo({ ...data, completed: false });
        setTodos((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (e) {
      setErr(e.message || 'Operation failed');
    }
  };

  const handleToggle = async (id, completed) => {
    setBusyIds((s) => new Set(s).add(id));
    try {
      const updated = await toggleComplete(id, completed);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setErr(e.message || 'Failed to update');
    } finally {
      setBusyIds((s) => {
        const ns = new Set(s);
        ns.delete(id);
        return ns;
      });
    }
  };

  const handleDelete = async (id) => {
    setBusyIds((s) => new Set(s).add(id));
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErr(e.message || 'Failed to delete');
    } finally {
      setBusyIds((s) => {
        const ns = new Set(s);
        ns.delete(id);
        return ns;
      });
    }
  };

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  return (
    <div className="App">
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <div className="logo">🌊</div>
            <div className="brand-text">
              <h1 className="title">Ocean Tasks</h1>
              <p className="subtitle">Professional ToDo Manager</p>
            </div>
          </div>
          <div className="top-actions">
            <button
              className="btn btn-ghost"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              + Add Task
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="summary">
            <div className="card stats">
              <div className="stats-item">
                <span className="stats-label">Total</span>
                <span className="stats-value">{todos.length}</span>
              </div>
              <div className="divider" />
              <div className="stats-item">
                <span className="stats-label">Completed</span>
                <span className="stats-value success">{completedCount}</span>
              </div>
            </div>
          </section>

          {err && <div className="alert error" role="alert">{err}</div>}

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TodoList
              items={todos}
              onToggle={(id, completed) => {
                if (busyIds.has(id)) return;
                handleToggle(id, completed);
              }}
              onEdit={(todo) => {
                if (busyIds.has(todo.id)) return;
                openEdit(todo);
              }}
              onDelete={(id) => {
                if (busyIds.has(id)) return;
                handleDelete(id);
              }}
            />
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Task' : 'Add Task'}
        ariaLabelledById="modal-title"
      >
        <TodoForm initialData={editing} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </div>
  );
}

export default App;
