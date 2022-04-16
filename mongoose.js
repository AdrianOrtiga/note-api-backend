const mongoose = require('mongoose')

// eslint-disable-next-line no-use-before-define
const DATABASE_URL = process.env.DATABASE_URL ? DATABASE_URL : 'mongodb://localhost/GoldenList'
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = mongoose.connection
