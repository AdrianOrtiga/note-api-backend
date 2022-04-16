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
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

noteScheme.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteScheme)
