const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()
  try {
    const requestToken = req.headers.authorization.split(' ')[1]
    if (requestToken.length === 0) {
      throw new Error('Authentication failed. No token provided.')
    }

    // Verify requestToken
    const payload = jwt.verify(requestToken, process.env.JWT_KEY)
    req.userData = payload
    next()
  } catch (err) {
    res.status(401)
    res.send('Authentication failed')
  }
}

module.exports = checkToken
