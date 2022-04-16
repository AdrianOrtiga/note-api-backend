const mongoose = require('mongoose')

const noteScheme = mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
    unique: true
  },
  learned: {
    type: Boolean,
    required: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Note', noteScheme)
