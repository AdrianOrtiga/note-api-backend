const supertest = require('supertest')
const { app } = require('../index')
const User = require('../model/users')

const api = supertest(app)

// users
const initialUsers = [
  {
    username: 'adridev',
    aka: 'coboloco',
    password: 'passw0rd'
  }
]

async function getAllUsers () {
  const usersDB = await User.find({})
  const users = usersDB.map(user => user.toJSON())
  return users
}

// notes
const initialNotes = [
  {
    userId: '62635b9bcd5211fce2672bec',
    content: 'que paso amigo',
    learned: false,
    date: Date.now()
  },
  {
    userId: '62635b9bcd5211fce2672bec',
    content: 'no paso nada tio',
    learned: false,
    date: Date.now()
  }
]

async function getAllnotes () {
  return await api.get('/api/notes')
}

async function getAllNotesProps () {
  const res = await api.get('/api/notes')
  return {
    contents: res.body.map(note => note.content),
    ids: res.body.map(note => note.id)
  }
}

module.exports = {
  api,
  initialUsers,
  getAllUsers,
  initialNotes,
  getAllnotes,
  getAllNotesProps
}
