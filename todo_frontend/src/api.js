const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Helper to handle HTTP errors and JSON parsing
async function http(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  let data = null;
  const contentType = res.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch (e) {
    // ignore parse errors; data stays null
  }

  if (!res.ok) {
    const msg = data && data.detail ? data.detail : (typeof data === 'string' ? data : 'Request failed');
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function getTodos() {
  /** Fetch all todos from the backend */
  return http('/api/todos', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createTodo(payload) {
  /** Create a new todo
   * payload: { title: string, description?: string }
   */
  return http('/api/todos', { method: 'POST', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function updateTodo(id, payload) {
  /** Update an existing todo by id
   * payload: { title?: string, description?: string, completed?: boolean }
   */
  return http(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo by id */
  return http(`/api/todos/${id}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export async function toggleComplete(id, completed) {
  /** Toggle a todo's completion status 
   * Backend exposes /api/todos/{id}/toggle (no request body required)
   */
  if (typeof completed === 'boolean') {
    // Fallback: If backend later supports body-based PATCH, keep this for compatibility
  }
  return http(`/api/todos/${id}/toggle`, { method: 'PATCH' });
}
