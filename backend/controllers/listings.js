const joi = require('joi')
const { v4: genUuid } = require('uuid')

const listingModels = require('../models/listings')

const create = async (req, res) => {
  const validationSchema = joi.object({
    user_id: joi
      .string()
      .guid({ version: ['uuidv4'] })
      .required(),
    title: joi.string().max(64).required(),
    description: joi.string().max(250).required(),
    price: joi.number().greater(0).max(9999999.99).required(),
    picture_url: joi
      .string()
      .uri({ scheme: ['http', 'https'] })
      .required()
  })

  const listing = {
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    picture_url: req.body.picture_url
  }

  try {
    const { error } = await validationSchema.validateAsync(listing)
    if (error) throw error
  } catch (err) {
    res.status(400).send(err.details[0].message)
    return
  }

  try {
    // Generate an uuid and write listing into database.
    listing.id = genUuid()
    const response = await listingModels.create(listing)
    if (response.affectedRows === 0) {
      throw new Error('Failed to write listing into database.')
    }

    // Respond to client with the created listing.
    res.status(201).send(listing)
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send('Something went wrong while creating listing. Please try again.')
  }
}

const update = async (req, res) => {
  const validationSchema = joi.object({
    id: joi
      .string()
      .guid({ version: ['uuidv4'] })
      .required(),
    user_id: joi
      .string()
      .guid({ version: ['uuidv4'] })
      .required(),
    title: joi.string().max(64).required(),
    description: joi.string().max(250).required(),
    price: joi.number().greater(0).max(9999999.99).required(),
    picture_url: joi.string().uri({ scheme: ['http', 'https'] })
  })

  const updatedListing = {
    id: req.body.id,
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    picture_url: req.body.picture_url
  }

  try {
    const { error } = await validationSchema.validateAsync(updatedListing)
    if (error) throw new Error('Validation failed')
  } catch (err) {
    res.status(400).send(err.details[0].message)
    return
  }

  // Check if the listing belongs to the user.
  try {
    const result = await listingModels.findByUserId(updatedListing.user_id)
    if (result.length === 0) throw new Error('Listing does not belong to the user.')
  } catch (err) {
    res.status(403).send('Cannot update someone else\'s listing')
    return
  }

  try {
    await listingModels.updateWithId(updatedListing)
    res.send(updatedListing)
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send('Something went wrong updating listing. Please try again.')
  }
}

module.exports = { create, update }
