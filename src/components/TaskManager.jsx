import React, { useEffect, useState } from 'react';
import Button from './Button';
import useLocalStorage from '../hooks/useLocalStorage'
import useApiTasks from '../hooks/useApiTasks'

/**
 * TaskManager component for managing tasks
 */
const TaskManager = () => {
  // Backend hook (talks to /api/tasks by default) and local fallback
  const api = useApiTasks({ page: 1, limit: 100 })
  const [useBackend, setUseBackend] = useState(true)

  const [localTasks, setLocalTasks] = useLocalStorage('tasks', [])
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter tasks based on selected filter
  // Choose source of truth (backend or local) and normalize id
  const sourceTasks = useBackend ? api.tasks : localTasks
  const filteredTasks = (sourceTasks || []).filter((task) => {
    const completed = task.completed
    if (filter === 'active') return !completed;
    if (filter === 'completed') return completed;
    return true
  });

  // Add a new task
  const addTask = async (text) => {
    if (!text.trim()) return
    if (useBackend) {
      try {
        await api.addTask(text)
      } catch (err) {
        // fallback to local if backend fails
        setUseBackend(false)
        const task = { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() }
        setLocalTasks(prev => [task, ...prev])
      }
    } else {
      const task = { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() }
      setLocalTasks(prev => [task, ...prev])
    }
  }

  // Toggle task completion
  const toggleTask = async (id) => {
    if (useBackend) {
      try {
        // backend uses _id
        const task = api.tasks.find(t => t._id === id || t.id === id)
        if (!task) return
        await api.toggleTask(task._id || task.id, !task.completed)
      } catch (err) {
        setUseBackend(false)
        setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
      }
    } else {
      setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    }
  }

  // Delete task
  const deleteTask = async (id) => {
    if (useBackend) {
      try {
        const task = api.tasks.find(t => t._id === id || t.id === id)
        if (!task) return
        await api.deleteTask(task._id || task.id)
      } catch (err) {
        setUseBackend(false)
        setLocalTasks(prev => prev.filter(t => t.id !== id))
      }
    } else {
      setLocalTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    await addTask(newTaskText)
    setNewTaskText('')
  }

  // If backend reports a persistent error, switch to local storage automatically
  useEffect(() => {
    if (api.error) {
      // if backend error occurs, fall back
      setUseBackend(false)
    }
  }, [api.error])

  // Allow user to sync local tasks to backend (useful if backend was down when tasks were created)
  const syncLocalToBackend = async () => {
    if (!localTasks || localTasks.length === 0) return
    let synced = 0
    for (const t of localTasks.slice().reverse()) {
      try {
        // avoid duplicate text if already in backend
        const existing = api.tasks.find(x => x.text === t.text)
        if (existing) continue
        await api.addTask(t.text)
        synced++
      } catch (err) {
        console.error('Sync failed for', t, err)
        setUseBackend(false)
        break
      }
    }
    if (synced > 0) {
      // clear localTasks that were synced
      const remaining = localTasks.filter(l => !api.tasks.find(x => x.text === l.text))
      setLocalTasks(remaining)
      // refresh api list
      api.fetchTasks({ page: 1, limit: 100 })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>

      {/* Backend status banner */}
      <div className="mb-4">
        {api.loading ? (
          <div className="text-sm text-gray-500">Checking backend...</div>
        ) : api.error || !useBackend ? (
          <div className="text-sm text-yellow-600 dark:text-yellow-400">Backend unavailable — using local storage. You can try to <button onClick={async () => { setUseBackend(true); await api.fetchTasks({ page:1, limit:100 }) }} className="underline">reconnect</button> or sync local tasks to backend.</div>
        ) : (
          <div className="text-sm text-green-600 dark:text-green-400">Backend connected — tasks stored in MongoDB.</div>
        )}
      </div>

      {/* Task input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <Button type="submit" variant="primary">
            Add Task
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2 mb-4">
        <Button variant="secondary" size="sm" onClick={syncLocalToBackend} disabled={!localTasks || localTasks.length === 0}>Sync local 192 backend</Button>
        <div className="text-sm text-gray-500">Local tasks: {localTasks.length} · Backend tasks: {api.tasks.length}</div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>

      {/* Task list */}
      <ul className="space-y-2">
        {filteredTasks.length === 0 ? (
          <li className="text-gray-500 dark:text-gray-400 text-center py-4">
            No tasks found
          </li>
        ) : (
          filteredTasks.map((task) => (
            <li
                key={task.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`${
                    task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                Delete
              </Button>
            </li>
          ))
        )}
      </ul>

      {/* Task stats */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          {(sourceTasks || []).filter((task) => !task.completed).length} tasks remaining
        </p>
      </div>
    </div>
  );
};

export default TaskManager; 