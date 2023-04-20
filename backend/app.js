const express = require('express')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: ['localhost'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

// Endpoint to check health of backend.
app.get('/pulsecheck', (req, res) => {
  res.send('Pulse OK.')
})

const users = require('./paths/users')
app.use('/api/users', users)

const listings = require('./paths/listings')
app.use('/api/listings', listings)

module.exports = app
