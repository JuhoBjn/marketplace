const pool = require('../db/pool')

const listingModels = {
  create: (listing) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const insertQuery = 'INSERT INTO listings SET ?;'
        connection.query(insertQuery, [listing], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    }),
  updateWithId: (updatedListing) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const updateQuery = 'UPDATE listings SET ? WHERE id=?;'
        connection.query(
          updateQuery,
          [updatedListing, updatedListing.id],
          (err, result) => {
            connection.release()
            if (err) return reject(err)
            resolve(result)
          }
        )
      })
    }),
  findAll: () =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const selectQuery = `SELECT listings.id, listings.user_id,
           listings.title, listings.description, listings.price,
           listings.picture_url, users.firstname, users.lastname, users.email,
           users.phone
           FROM listings
           LEFT JOIN users ON listings.user_id = users.id
           ORDER BY listings.created;`
        connection.query(selectQuery, (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    }),
  findByUserId: (userId) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const selectQuery = `SELECT listings.id, listings.user_id,
          listings.title, listings.description, listings.price,
          listings.picture_url, users.firstname, users.lastname, users.email,
          users.phone
          FROM listings
          LEFT JOIN users ON listings.user_id = users.id
          WHERE user_id=?
          ORDER BY  listings.created;`
        connection.query(selectQuery, [userId], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    }),
  findByListingId: (listingId) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const selectQuery = 'SELECT * FROM listings WHERE id=?;'
        connection.query(selectQuery, [listingId], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    }),
  deleteById: (listingId) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const deleteQuery = 'DELETE FROM listings WHERE id=?;'
        connection.query(deleteQuery, [listingId], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    })
}

module.exports = listingModels
