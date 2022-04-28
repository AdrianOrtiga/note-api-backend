/* eslint-disable no-undef */
const { server } = require('../index')
const { default: mongoose } = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../model/users')
const { api, initialUsers, getAllUsers } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    const { username, aka, password } = user
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({ username, aka, passwordHash })
    await newUser.save()
  }
})

describe('Get api/users', () => {
  test('should get all the users correctly', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST api/users', () => {
  test('should add new user correctly', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'abc',
      aka: '45',
      password: 'tru3'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain('abc')
  })

  test('should not add user with an existing username', async () => {
    const usersAtStart = await getAllUsers()
    console.log({ usersAtStart })
    const newUser = {
      username: 'adridev',
      aka: '23',
      password: 'fals3'
    }

    // if it is not use Atlas mongo db the unique attribute in the model doesn't work
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error.code).toBe(11000) // 11000 code means duplicate key
    expect(result.body.error.keyPattern).toHaveProperty('username', 1) // 11000 code means duplicate key
    const usersAtEnd = await getAllUsers()
    console.log({ usersAtEnd })
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('should not add user without username', async () => {
    const usersAtStart = await getAllUsers()
    console.log({ usersAtStart })
    const newUser = {
      aka: '23',
      password: 'fals3'
    }

    // if it is not use Atlas mongo db the unique attribute in the model doesn't work
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error.errors.username.kind).toBe('required') // 11000 code means duplicate key
    expect(result.body.error.errors.username.properties.message).toContain('Path `username` is required.') // 11000 code means duplicate key
    const usersAtEnd = await getAllUsers()
    console.log({ usersAtEnd })
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

// eslint-disable-next-line no-undef
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
