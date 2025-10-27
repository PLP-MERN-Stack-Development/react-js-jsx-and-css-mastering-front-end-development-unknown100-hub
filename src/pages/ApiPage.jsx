import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

const PAGE_SIZE = 10

export default function ApiPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const abort = new AbortController()
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${PAGE_SIZE}`, { signal: abort.signal })
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        setItems(prev => (page === 1 ? data : [...prev, ...data]))
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => abort.abort()
  }, [page])

  const filtered = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.body.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Posts (JSONPlaceholder)</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="px-3 py-2 rounded border dark:bg-gray-700 dark:border-gray-600"
          />
          <Button variant="secondary" onClick={() => { setPage(1); setItems([]) }}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <Card key={item.id}>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.body}</p>
            <div className="text-xs text-gray-500">ID: {item.id}</div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center mt-4">
        {error && <div className="text-red-500 mr-4">Error: {error}</div>}
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <Button variant="primary" onClick={() => setPage(p => p + 1)}>Load more</Button>
        )}
      </div>
    </div>
  )
}
