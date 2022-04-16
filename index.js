const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const db = require('./mongoose')
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// routes
const notesRoute = require('./routes/notes')

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api/notes', notesRoute)

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
