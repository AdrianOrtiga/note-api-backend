const express = require('express')
const router = express.Router()
const Note = require('../model/notes')

router.get('/', (req, res) => {
  Note.find()
    .then(notes => res.json(notes))
    .catch(error => res.json(error))
})

router.post('/', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'content is missing'
    })
  }

  Note.find()
    .then(notes => {
      const ids = notes.map(note => note.id)
      const maxId = Math.max(...ids)
      const newNote = new Note({
        userId: note.userId,
        id: maxId + 1,
        content: note.content,
        learned: note.learned
      })
      newNote.save()
        .then(result => res.json(result))
        .catch(error => res.json(error))
    })
    .catch(error => res.json(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        return res.json(note)
      }
      res.status(404).end()
    })
    .catch(error => res.json(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Note.deleteOne({ id: id })
    .then(result => res.json(result))
    .catch(error => res.json(error))
})

module.exports = router
