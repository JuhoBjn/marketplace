const joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: genUuid } = require('uuid')
const userModels = require('../models/users')

const signup = async (req, res) => {
  const validationSchema = joi.object({
    firstname: joi.string().max(25).required(),
    lastname: joi.string().max(45).required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .min(7)
      .max(13)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().min(8).required()
  })

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password
  }

  try {
    const { error } = await validationSchema.validateAsync(newUser)
    if (error) throw error
  } catch (err) {
    return res.status(400).send(err.details[0].message)
  }

  // Check that no user with the given email exists.
  try {
    const response = await userModels.findByEmail(newUser.email)
    if (response.length > 0) {
      return res.status(400).send('A user with this email already exists')
    }
  } catch (err) {
    return res.status(500).send('Failed to create new user. Please try again.')
  }

  try {
    // Create password hash.
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw err
      }
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) {
          throw err
        }
        newUser.password = hash

        // Generate uuid and write new user to database.
        newUser.id = genUuid()
        const response = await userModels.create(newUser)
        if (response.affectedRows === 0) {
          throw new Error('Failed to write new user into database.')
        }

        // Generate token and respond to client.
        const payload = {
          id: newUser.id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email
        }
        jwt.sign(
          payload,
          process.env.JWT_KEY,
          { expiresIn: '1h' },
          (err, token) => {
            if (err) throw err
            payload.token = token
            res.status(201).send(payload)
          }
        )
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Failed to create new user. Please try again.')
  }
}

const login = async (req, res) => {
  // Validate given input.
  const validationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
  })

  const userCredentials = {
    email: req.body.email,
    password: req.body.password
  }

  try {
    const { error } = await validationSchema.validateAsync(userCredentials)
    if (error) throw error
  } catch (err) {
    res.status(400).send(err.details[0].message)
    return
  }

  // Check if the user exists.
  const user = await userModels.findByEmail(userCredentials.email)
  if (user.length === 0) {
    res.status(401).send('Could not find user for given email')
    return
  }

  try {
    // Check password.
    const match = await bcrypt.compare(
      userCredentials.password,
      user[0].password
    )

    if (!match) {
      res
        .status(401)
        .send(
          'Invalid credentials. Please check email and password and try again.'
        )
      return
    }

    // User credentials are correct. Generate token and respond to client.
    const payload = {
      id: user[0].id,
      firstname: user[0].firstname,
      lastname: user[0].lastname,
      email: user[0].email
    }
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err
        payload.token = token
        res.send(payload)
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Failed to log in user. Please try again.')
  }
}

module.exports = { signup, login }
