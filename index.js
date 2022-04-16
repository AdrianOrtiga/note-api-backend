const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./mongoose')

// routes
const notesRoute = require('./routes/notes')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api/notes', notesRoute)
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
