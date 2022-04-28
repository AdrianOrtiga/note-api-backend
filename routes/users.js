const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const User = require('../model/users')

router.get('/', async (req, res) => {
  try {
    const notes = await User.find({}).populate('notes', {
      content: 1,
      date: 1,
      learned: 1
    })
    return res.json(notes)
  } catch (error) {
    return res.status(404).json(error)
  }
})

router.post('/', async (req, res, next) => {
  const { body } = req
  const { username, aka, password } = body

  try {
    const saltHash = 10
    const passwordHash = await bcrypt.hash(password, saltHash)

    const newUser = new User({
      username,
      aka,
      passwordHash
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  User.deleteOne({ _id: id })
    .then(result => res.json(result))
    .catch(error => next(error))
})

module.exports = router
