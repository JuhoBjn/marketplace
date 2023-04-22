const supertest = require('supertest')
const {
  describe,
  it,
  expect,
  afterEach,
  beforeAll,
  afterAll
} = require('@jest/globals')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const pool = require('../db/pool')

describe('User signup endpoint', () => {
  afterEach(() => {
    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) return reject(error)
        const deleteQuery = 'DELETE FROM users WHERE email=?;'
        connection.query(deleteQuery, ['test@user.com'], (error, response) => {
          connection.release()
          if (error) return reject(error)
          resolve(response)
        })
      })
    })
  })

  it('should allow a user to sign up with valid credentials', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@user.com',
      phone: '0123456789',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body.id).toBeTruthy()
    expect(response.body.firstname).toBeTruthy()
    expect(response.body.lastname).toBeTruthy()
    expect(response.body.email).toBeTruthy()
    expect(response.body.token).toBeTruthy()
  })

  it('should not allow creation of two users with the same email', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@user.com',
      phone: '0123456789',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    const response2 = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(201)
    expect(response2.status).toEqual(400)
    expect(response2.text).toEqual('A user with this email already exists')
  })

  it('should not allow a user to sign up without a first name', async () => {
    const testUser = {
      firstname: '',
      lastname: 'User',
      email: 'test@user.com',
      phone: '0123456789',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.text).toEqual('"firstname" is not allowed to be empty')
  })

  it('should not allow a user to sign up without a last name', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: '',
      email: 'test@user.com',
      phone: '0123456789',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.text).toEqual('"lastname" is not allowed to be empty')
  })

  it('should not allow a user to sign up without an email', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: '',
      phone: '0123456789',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.text).toEqual('"email" is not allowed to be empty')
  })

  it('should not allow a user to sign up without a phone number', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@user.com',
      phone: '',
      password: 'test@user123'
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.text).toEqual('"phone" is not allowed to be empty')
  })

  it('should not allow a user to sign up without a password', async () => {
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@user.com',
      phone: '0123456789',
      password: ''
    }

    const response = await supertest(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.text).toEqual('"password" is not allowed to be empty')
  })
})

describe('User login endpoint', () => {
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const testUser = {
        id: '7997f9f8-b006-4cde-a1b1-18dcb4aafea9',
        firstname: 'Tommy',
        lastname: 'Test',
        email: 'tommy@test.com',
        phone: '0123456789',
        password: 'tommy@test123'
      }
      bcrypt.hash(testUser.password, 10, (error, hash) => {
        if (error) return reject(error)
        testUser.password = hash

        pool.getConnection((error, connection) => {
          if (error) return reject(error)
          const insertQuery = 'INSERT INTO users SET ?;'
          connection.query(insertQuery, [testUser], (error, result) => {
            connection.release()
            if (error) return reject(error)
            resolve(result)
          })
        })
      })
    })
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) return reject(error)
        const deleteQuery = 'DELETE FROM users WHERE email=?;'
        connection.query(deleteQuery, ['tommy@test.com'], (error, result) => {
          connection.release()
          if (error) return reject(error)
          resolve(result)
        })
      })
    })
  })

  it('should allow a user to log in with valid credentials', async () => {
    const testUser = {
      email: 'tommy@test.com',
      password: 'tommy@test123'
    }

    const response = await supertest(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body.id).toBeTruthy()
    expect(response.body.firstname).toBeTruthy()
    expect(response.body.lastname).toBeTruthy()
    expect(response.body.email).toBe(testUser.email)
    expect(response.body.token).toBeTruthy()
  })

  it('should not allow a user to login without valid credentials', async () => {
    const testUser = {
      email: 'tommy@test.com',
      password: 'wrongP4ssword'
    }

    const response = await supertest(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toBe(401)
    expect(response.text).toBe(
      'Invalid credentials. Please check email and password and try again.'
    )
  })

  it('should not allow a user to log in without an account', async () => {
    const testUser = {
      email: 'jane@doe.com',
      password: 'jane@doe123'
    }

    const response = await supertest(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(401)
    expect(response.text).toBe('Could not find user for given email')
  })

  it('should not allow a user to login without email address', async () => {
    const testUser = {
      email: '',
      password: 'tommy@test123'
    }

    const response = await supertest(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"email" is not allowed to be empty')
  })

  it('should not allow a user to log in without password', async () => {
    const testUser = {
      email: 'tommy@test.com',
      password: ''
    }

    const response = await supertest(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"password" is not allowed to be empty')
  })
})

const checkToken = require('../middleware/checkToken')

describe('Verify token middleware', () => {
  it('should allow request if the request contains a valid token', () => {
    const payload = {
      id: '123oiusfd',
      firstname: "Tommy",
      lastname: "Test",
      email: 'tommy@test.com'
    }
    const token = jwt.sign(payload, process.env.JWT_KEY)
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = {}
    const next = jest.fn(() => {
      return true
    })
    checkToken(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should return an error if the request has invalid token', () => {
    // Mock token generated on https://jwt.io
    // Header = { "alg": "HS256", "typ": "JWT" }
    // Payload = { "sub": "1234567890", "name: "John Doe", "iat": "1516239022" }
    // Verify Signature = { HMACSHA256(base64UrlEncode(header) + "." +base64UrlEncode(payload), "super-secret-hehe")}
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Kw6H3veC_nvZTyqf0xRiizlbY4ZO1vfwmCSVzxiPSKM'
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
    const next = jest.fn(() => {
      return true
    })
    checkToken(req, res, next)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith('Authentication failed')
  })

  it('should return an error when no token is provided in the request', () => {
    const token = ''
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    }
    const next = jest.fn(() => {
      return true
    })
    checkToken(req, res, next)

    expect(res.status).toBeCalledWith(401)
    expect(res.send).toBeCalledWith('Authentication failed')
  })
})
