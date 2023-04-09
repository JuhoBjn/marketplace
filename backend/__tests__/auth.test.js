const supertest = require('supertest')
const { describe, it, expect, afterEach } = require('@jest/globals')

const app = require('../app')
const pool = require('../db/pool')

describe('Authentication endpoints', () => {
  afterEach(() => {
    pool.getConnection((error, connection) => {
      if (error) console.log(error)
      connection.query(
        'DELETE FROM users WHERE email LIKE ?;',
        'test@user.com',
        (error, response) => {
          connection.release()
          if (error) console.log(error)
        }
      )
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(201)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body.id).toBeTruthy()
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    const response2 = await supertest(app)
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(201)
    expect(response2.status).toEqual(400)
    expect(response2.message).toEqual('A user with this email already exists')
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.message).toEqual('User must have a first name')
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.message).toEqual('User must have a last name')
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.message).toEqual('User must have an email')
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.message).toEqual('User must have a phone number')
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
      .post('/users/signup')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(testUser)

    expect(response.status).toEqual(400)
    expect(response.message).toEqual('User must have a password')
  })
})
