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
    })
}

module.exports = listingModels
