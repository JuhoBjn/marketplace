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
  findByUserId: (userId) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const selectQuery = 'SELECT * FROM users WHERE id=?;'
        connection.query(selectQuery, [userId], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    })
}

module.exports = listingModels
