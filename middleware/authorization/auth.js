const jwt = require('jsonwebtoken')

const config = process.env

const verifyToken = (req, res, next) => {
  // "Bearer .tokenCode"
  const authorization = req.get('authorization')
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    req.user = decoded
  } catch (error) {
    return res.status(401).json({ error: 'A token is required for authentication or invalid' })
  }
  return next()
}

module.exports = verifyToken
