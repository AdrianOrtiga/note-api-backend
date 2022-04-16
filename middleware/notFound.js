module.exports = (req, res, next) => {
  console.log(req.path)
  res.status(404).json({ error: 'Not found' })
}
