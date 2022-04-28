const { default: mongoose } = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  aka: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  notes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }],
    required: false
  },
  token: {
    type: String
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
