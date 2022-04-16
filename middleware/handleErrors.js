module.exports = (error, req, res, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'id user is incorrect' })
  }
  return res.status(500).end()
}
