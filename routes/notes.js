const express = require('express')
const router = express.Router()
const Note = require('../model/notes')

router.get('/', (req, res) => {
  Note.find()
    .then(notes => {
      res.json(notes)
    })
    .catch(error => res.json(error))
})

router.post('/', (req, res) => {
  const note = req.body
  if (!note || !note.content) {
    return res.status(400).json({ error: 'content is missing' })
  }
  const newNote = new Note({
    userId: note.userId,
    content: note.content,
    learned: note.learned
  })
  newNote.save()
    .then(result => res.json(result))
    .catch(error => res.json(error))
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        return res.json(note)
      }
      res.status(404).end()
    })
    .catch(error => {
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    learned: note.learned
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => res.json(result))
    .catch(error => next(error))
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  Note.deleteOne({ _id: id })
    .then(result => res.json(result))
    .catch(error => next(error))
})

module.exports = router
