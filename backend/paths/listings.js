const express = require('express')
const router = express.Router()

const checkToken = require('../middleware/checkToken')

const { create } = require('../controllers/listings')

router.use(checkToken)
router.post('/create', create)

module.exports = router
