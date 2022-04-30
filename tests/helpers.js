const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const { app } = require('../index')
const User = require('../model/users')

const api = supertest(app)
const AUTH_METHOD = 'Bearer'

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

async function getFirstUser () {
  const user = await User.findOne({ username: initialUsers[0].username })
  return user
}

async function getUser (username) {
  const user = await User.findOne({ username: username })
  console.log({ user, username })
  return user
}

async function getToken () {
  const user = await User.findOne({ username: initialUsers[0].username })

  return jwt.sign(
    { id: user._id },
    process.env.TOKEN_KEY,
    {
      expiresIn: '2h'
    }
  )
}

async function deleteAllnotesFor (id) {
  const delNotesUser = {
    notes: []
  }
  await User.findByIdAndUpdate(id, delNotesUser, { new: true })
}

// notes
const initialNotes = [
  {
    content: 'que paso amigo',
    learned: false,
    date: Date.now()
  },
  {
    content: 'no paso nada tio',
    learned: false,
    date: Date.now()
  }
]

async function getAllnotes () {
  const token = await getToken()
  return await api.get('/api/notes').set('authorization', `${AUTH_METHOD} ${token}`)
}

async function getAllNotesProps () {
  const token = await getToken()
  const res = await api.get('/api/notes').set('authorization', `${AUTH_METHOD} ${token}`)
  return {
    contents: res.body.map(note => note.content),
    ids: res.body.map(note => note.id)
  }
}

module.exports = {
  api,
  AUTH_METHOD,
  initialUsers,
  getAllUsers,
  getFirstUser,
  getUser,
  getToken,
  deleteAllnotesFor,
  initialNotes,
  getAllnotes,
  getAllNotesProps
}
