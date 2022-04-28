const { default: mongoose } = require('mongoose')
const { server } = require('../index')

/* eslint-disable no-undef */
const { api } = require('./helpers')

describe('POST /api/login', () => {
  test('should login and return a JSON Token if username an password correct', async () => {
    const loginReq = {
      username: 'adridev',
      password: 'passw0rd'
    }

    await api
      .post('/api/login')
      .send(loginReq)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should not login if password is not correct', async () => {
    const loginReq = {
      username: 'adridev',
      password: 'passw0r'
    }

    await api
      .post('/api/login')
      .send(loginReq)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('should not login if username does not exist', async () => {
    const loginReq = {
      username: 'adride',
      password: 'passw0rd'
    }

    await api
      .post('/api/login')
      .send(loginReq)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

// eslint-disable-next-line no-undef
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
