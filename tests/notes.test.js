/* eslint-disable no-undef */
// Imports -------------------------------------------------------
const { default: mongoose } = require('mongoose')

const { server } = require('../index')
const Note = require('../model/notes')
const {
  api,
  AUTH_METHOD,
  initialNotes,
  getFirstUser,
  getAllnotes,
  getAllNotesProps,
  getUser,
  getToken
} = require('./helpers')
// -----------------------------------------------------------------

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const user = await getFirstUser()
    if (user === undefined) throw new Error('user undifined')

    const { content, learned, date } = note
    const newNote = new Note({
      content,
      learned,
      date,
      userId: user.id
    })
    await newNote.save()
  }
})
// *********************************************************

describe('GET /api/notes', () => {
  test('should return a 401 if no user has log in', async () => {
    await api
      .get('/api/notes')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  // -----------------------------------------------------------------
  test('should return notes as a json file if user is log in', async () => {
    const token = await getToken()

    await api
      .get('/api/notes')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  // -----------------------------------------------------------------

  test('should be 2 notes', async () => {
    const res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
  })
  // -----------------------------------------------------------------

  test('should get a note with the correct id', async () => {
    const { body: notes } = await getAllnotes()
    const { id } = notes[0]
    expect(typeof id).toBe('string')

    const token = await getToken()
    const req = `/api/notes/${id}`
    await api
      .get(req)
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  // -----------------------------------------------------------------

  test('should not find a no existing note', async () => {
    const req = '/api/notes/1234587dekerudk'
    const token = await getToken()
    await api
      .get(req)
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
// *********************************************************

describe('POST /api/notes', () => {
  test('should add a new note correctly', async () => {
    const newNote = {
      username: 'adridev',
      content: 'adfe daefe'
    }

    const token = await getToken()

    await api
      .post('/api/notes')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    const contents = res.body.map(note => note.content)
    expect(contents).toContain(newNote.content)
    expect(res.body).toHaveLength(initialNotes.length + 1)

    const notesIds = res.body.map(note => note.id)
    const user = await getUser(newNote.username)
    const notesUserId = [user.notes.toString()]
    expect(typeof notesUserId[0]).toBe('string')
    expect(notesIds).toEqual(expect.arrayContaining(notesUserId))
  })
  // -----------------------------------------------------------------

  test('should add a new note correctly', async () => {
    const username = 'adridev'
    const userWithoutNote = await getUser(username)

    expect(userWithoutNote.username).toBe(username)
    const newNote = {
      username: username,
      content: 'adfe daefe'
    }

    // {
    //   const userWithNote = await getUser(newNote.username)
    //   const notesUserId = [userWithNote.notes.toString()]
    //   expect(notesUserId).toBe(1)
    // }
    const token = await getToken()

    await api
      .post('/api/notes')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    const contents = res.body.map(note => note.content)
    expect(contents).toContain(newNote.content)
    expect(res.body).toHaveLength(initialNotes.length + 1)

    const userWithNote = await getUser(newNote.username)
    const notesUserId = [userWithNote.notes.toString()]
    expect(typeof notesUserId[0]).toBe('string')
  })
  // -----------------------------------------------------------------

  test('should not add a note without content', async () => {
    const newNote = {
      userId: 'adfe daefe'
    }

    const token = await getToken()
    await api
      .post('/api/notes')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
  })
  // -----------------------------------------------------------------

  test('should not add a note with an invalid id', async () => {
    const newNote = {
      userId: 1,
      content: 'adfe daefe'
    }

    const token = await getToken()
    await api
      .post('/api/notes')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
  })
})
// *********************************************************

describe('PUT /api/notes', () => {
  test('should update a note correctly', async () => {
    const newNote = {
      content: 'ha ha ha',
      learned: true
    }

    let res = await getAllnotes()
    const putReq = `/api/notes/${res.body[0].id}`

    const token = await getToken()

    await api
      .put(putReq)
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
    expect(res.body[0].content).toBe('ha ha ha')
    expect(res.body[0].learned).toBe(true)
  })
})
// *********************************************************

describe('DELETE /api/notes', () => {
  test('should delete a note correctly', async () => {
    const { body: notes } = await getAllnotes()
    const deleteNoteId = notes[0].id
    const oldNoteContent = notes[0].content
    const deleteReq = `/api/notes/${deleteNoteId}`

    const token = await getToken()
    await api
      .delete(deleteReq)
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    const { ids, contents } = await getAllNotesProps()
    expect(res.body).toHaveLength(initialNotes.length - 1)
    expect(ids).not.toContain(deleteNoteId)
    expect(contents).not.toContain(oldNoteContent)
  })
  // -----------------------------------------------------------------

  test('should not delete a note that does not exist', async () => {
    const { body: notes } = await getAllnotes()
    expect(notes).toHaveLength(initialNotes.length)

    const token = await getToken()
    await api
      .delete('/api/notes/123skf93432')
      .set('authorization', `${AUTH_METHOD} ${token}`)
      .expect(400)

    const res = await getAllnotes()
    expect(res.body).toHaveLength(notes.length)
  })
})

// eslint-disable-next-line no-undef
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
