const express = require('express')
const Task = require('../models/Task')

const router = express.Router()

// GET /api/tasks?search=&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const q = search ? { text: { $regex: search, $options: 'i' } } : {}
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit)
    const items = await Task.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
    const total = await Task.countDocuments(q)
    res.json({ items, total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' })
    const task = await Task.create({ text: text.trim() })
    console.log('Created task:', task)
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tasks/:id - update fields (text, completed)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
    if (!task) return res.status(404).json({ error: 'Not found' })
    console.log('Updated task:', task)
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findByIdAndDelete(id)
    if (!task) return res.status(404).json({ error: 'Not found' })
    console.log('Deleted task id:', id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
