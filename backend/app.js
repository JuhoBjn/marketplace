const express = require('express')
const cors = require('cors')

const app = express()

const corsOptions = {
  origin: 'localhost:5173',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/pulsecheck', (req, res) => {
  res.send('Pulse OK.')
})

module.exports = app
