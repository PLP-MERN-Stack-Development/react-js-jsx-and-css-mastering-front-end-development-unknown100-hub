require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const tasksRouter = require('./routes/tasks')
const Task = require('./models/Task')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Simple request logger to help debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
  next()
})

app.use('/api/tasks', tasksRouter)

app.get('/', (req, res) => res.json({ ok: true }))

// debug endpoint to check MongoDB connection state
app.get('/api/debug', (req, res) => {
  const state = mongoose.connection.readyState // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  res.json({ connectedState: state, db: mongoose.connection.name || null })
})

// Quick test endpoint to write a test task into MongoDB
app.post('/api/test-write', async (req, res) => {
  try {
    const text = req.body.text || `test-${Date.now()}`
    const t = await Task.create({ text })
    console.log('Test write created:', t)
    res.status(201).json(t)
  } catch (err) {
    console.error('Test write error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Quick test endpoint to read recent tasks
app.get('/api/test-read', async (req, res) => {
  try {
    const items = await Task.find({}).sort({ createdAt: -1 }).limit(20)
    res.json({ items })
  } catch (err) {
    console.error('Test read error:', err)
    res.status(500).json({ error: err.message })
  }
})

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tasks-demo'
  try {
    // Connect and attach listeners for clearer diagnostics
    mongoose.connection.on('connected', () => console.log('Mongoose connected to', mongoose.connection.name || uri))
    mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err && err.message ? err.message : err))
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))

    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
  } catch (err) {
    console.error('Failed to connect to MongoDB:')
    console.error(err && err.stack ? err.stack : err)
    process.exit(1)
  }
}

start()
