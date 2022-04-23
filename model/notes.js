const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  learned: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
