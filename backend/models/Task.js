const { Schema, model } = require('mongoose')

const TaskSchema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = model('Task', TaskSchema)
