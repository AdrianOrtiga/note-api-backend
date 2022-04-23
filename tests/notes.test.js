/* eslint-disable no-undef */
const { default: mongoose } = require('mongoose')

const { server } = require('../index')
const Note = require('../model/notes')
const { api, initialNotes, getAllnotes, getAllNotesProps } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const newNote = new Note(note)
    await newNote.save()
  }
})

describe('GET /api/notes', () => {
  test('should return notes as a json file', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should be 2 notes', async () => {
    const res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
  })
})

describe('POST /api/notes', () => {
  test('should add a new note correctly', async () => {
    const newNote = {
      userId: '62635b9bcd5211fce2672bec',
      content: 'adfe daefe'
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    const contents = res.body.map(note => note.content)
    expect(contents).toContain(newNote.content)
    expect(res.body).toHaveLength(initialNotes.length + 1)
  })

  test('should not add a note without content', async () => {
    const newNote = {
      userId: 'adfe daefe'
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
  })
})

describe('PUT /api/notes', () => {
  test('should update a note correctly', async () => {
    const newNote = {
      userId: 1,
      content: 'ha ha ha',
      learned: true
    }

    let res = await getAllnotes()
    const putReq = `/api/notes/${res.body[0].id}`

    await api
      .put(putReq)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    res = await getAllnotes()
    expect(res.body).toHaveLength(initialNotes.length)
    expect(res.body[0].content).toBe('ha ha ha')
    expect(res.body[0].learned).toBe(true)
  })
})

describe('DELETE /api/notes', () => {
  test('should delete a note correctly', async () => {
    const { body: notes } = await getAllnotes()
    const deleteNoteId = notes[0].id
    const oldNoteContent = notes[0].content
    const deleteReq = `/api/notes/${deleteNoteId}`

    await api
      .delete(deleteReq)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const res = await getAllnotes()
    const { ids, contents } = await getAllNotesProps()
    expect(res.body).toHaveLength(initialNotes.length - 1)
    expect(ids).not.toContain(deleteNoteId)
    expect(contents).not.toContain(oldNoteContent)
  })

  test('should not delete a note that does not exist', async () => {
    const { body: notes } = await getAllnotes()
    expect(notes).toHaveLength(initialNotes.length)

    await api
      .delete('/api/notes/123skf93432')
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
