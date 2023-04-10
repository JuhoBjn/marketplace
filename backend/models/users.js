const pool = require('../db/pool')

const users = {
  findByEmail: (email) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        const fetchQuery = 'SELECT * FROM users WHERE email=?;'
        connection.query(fetchQuery, [email], (err, result) => {
          connection.release()
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(result)
        })
      })
    }),
  create: (user) =>
    new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        const createQuery = 'INSERT INTO users SET ?;'
        connection.query(createQuery, [user], (err, result) => {
          connection.release()
          if (err) {
            console.error(err)
            return reject(err)
          }
          resolve(result)
        })
      })
    })
}

module.exports = users
