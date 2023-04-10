const express = require('express')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: ['localhost'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/pulsecheck', (req, res) => {
  res.send('Pulse OK.')
})

const users = require('./paths/users')
app.use('/api/users', users)

module.exports = app
