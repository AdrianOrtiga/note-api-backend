const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../model/users')

router.post('/', async (req, res) => {
  const { body } = req
  const { username, password } = body

  try {
    const user = await User.findOne({ username: username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'invalid user or password'
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    )

    user.token = token

    return res.send({
      username: user.username,
      aka: user.aka,
      token: user.token
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

module.exports = router
