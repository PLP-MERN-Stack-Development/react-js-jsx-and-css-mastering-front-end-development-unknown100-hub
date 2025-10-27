import { useState, useEffect } from 'react'

const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || '/api')

export default function useApiTasks({ page = 1, limit = 100 } = {}) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchTasks({ search = '', page = 1, limit = 100 } = {}) {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), _: String(Date.now()) })
      if (search) params.set('search', search)
      const endpoint = `${API_BASE}/tasks?${params.toString()}`
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
        // normalize items to include `id` (frontend-friendly)
        const items = (data.items || []).map(i => ({ ...i, id: i._id || i.id }))
        setTasks(items)
      setLoading(false)
      return data
    } catch (err) {
      setError(err.message || 'Failed to load')
      setLoading(false)
      return null
    }
  }

  useEffect(() => { fetchTasks({ page, limit }) }, [])

  async function addTask(text) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    if (!res.ok) throw new Error('Add failed')
  const item = await res.json()
  const normalized = { ...item, id: item._id || item.id }
  setTasks(t => [normalized, ...t])
  return normalized
  }

  async function toggleTask(id, completed) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    })
    if (!res.ok) throw new Error('Update failed')
  const updated = await res.json()
  const norm = { ...updated, id: updated._id || updated.id }
  setTasks(t => t.map(x => (x._id === updated._id || x.id === norm.id) ? norm : x))
  return norm
  }

  async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete failed')
    setTasks(t => t.filter(x => x._id !== id && x.id !== id))
    return true
  }

  return { tasks, fetchTasks, addTask, toggleTask, deleteTask, loading, error }
}
