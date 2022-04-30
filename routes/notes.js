const express = require('express')
const router = express.Router()
const Note = require('../model/notes')
const User = require('../model/users')
const auth = require('../middleware/authorization/auth')

router.get('/', auth, (req, res) => {
  Note.find({ userId: req.user.id })
    .then(notes => {
      res.json(notes)
    })
    .catch(error => res.json(error))
})

router.post('/', auth, async (req, res) => {
  const {
    content,
    learned = false
  } = req.body

  const id = req.user.id

  try {
    const user = await User.findById(id)
    console.log(user)
    if (!content) {
      return res.status(400).json({ error: 'content is missing' })
    }
    const newNote = new Note({
      userId: id,
      content,
      learned
    })
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote.id)
    await user.save()

    return res.json(savedNote)
  } catch (error) {
    return res.status(400).json(error)
  }
})

router.get('/:id', auth, async (req, res, next) => {
  const id = req.params.id
  try {
    const note = await Note.findById(id)
    if (note) {
      return res.json(note)
    }

    return res.status(404).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', auth, (req, res, next) => {
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

router.delete('/:id', auth, (req, res, next) => {
  const { id } = req.params
  Note.deleteOne({ _id: id })
    .then(result => res.json(result))
    .catch(error => next(error))
})

module.exports = router
