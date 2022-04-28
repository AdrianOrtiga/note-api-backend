const ERROR_HANDLERS = {
  CastError: (res, error) =>
    res.status(400).send({ error: 'id user is incorrect' }),

  JsonWebTokenError: (res, error) =>
    res.status(401).send({ error: 'A token required or invalid for authorization' }),

  defaultError: res => res.status(500).end()
}

module.exports = (error, req, res, next) => {
  // console.log(error)
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(res, error)
}
