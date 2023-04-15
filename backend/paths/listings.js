const express = require('express')
const router = express.Router()

const checkToken = require('../middleware/checkToken')

const { create, update } = require('../controllers/listings')

router.use(checkToken)
router.post('/create', create)
router.put('/update', update)

module.exports = router
