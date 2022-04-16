const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

let notes = [
  {
    userId: 1,
    id: 1,
    content: 'bear dog',
    learned: false
  },
  {
    userId: 1,
    id: 2,
    content: 'rag doll',
    learned: false
  },
  {
    userId: 1,
    id: 3,
    content: 'I am down',
    learned: false
  }
]

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.post('/api/notes/', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    userId: 1,
    id: maxId + 1,
    content: note.content,
    learned: note.learned
  }
  notes.push(newNote)
  console.log(notes)
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    return res.json(note)
  }

  res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id === id)
  res.status(204).end()
})

app.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
