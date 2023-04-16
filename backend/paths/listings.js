const express = require('express')
const router = express.Router()

const checkToken = require('../middleware/checkToken')

const { create, update, findAll, findAllFromUser } = require('../controllers/listings')

router.get('/', findAll)
router.get('/:id', findAllFromUser)
router.use(checkToken)
router.post('/create', create)
router.put('/update', update)

module.exports = router
