const { describe, it, beforeAll, afterAll, expect } = require('@jest/globals')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const pool = require('../db/pool')

describe('Create listing endpoint', () => {
  const user = {}

  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const testUser = {
        id: 'b2862249-38f8-40cf-8e52-16428d837aa6',
        firstname: 'John',
        lastname: 'Test',
        email: 'john@test.com',
        phone: '1234567890',
        password: 'john@test1234'
      }
      bcrypt.hash(testUser.password, 10, (err, hash) => {
        if (err) return reject(err)
        testUser.password = hash

        pool.getConnection((err, connection) => {
          if (err) return reject(err)
          const insertQuery = 'INSERT INTO users SET ?;'
          connection.query(insertQuery, [testUser], (err, result) => {
            connection.release()
            if (err) return reject(err)
            resolve(result)
          })
        })

        user.id = testUser.id
        user.email = testUser.email
        user.token = jwt.sign(user, process.env.JWT_KEY)
      })
    })
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)
        const deleteListingsQuery = 'DELETE FROM listings WHERE user_id=?;'
        connection.query(
          deleteListingsQuery,
          ['b2862249-38f8-40cf-8e52-16428d837aa6'],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )
        const deleteQuery = 'DELETE FROM users WHERE id=?;'
        connection.query(
          deleteQuery,
          ['b2862249-38f8-40cf-8e52-16428d837aa6'],
          (err, result) => {
            connection.release()
            if (err) return reject(err)
            resolve(result)
          }
        )
      })
    })
  })

  it('should allow a logged in user to create a listing', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(201)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toEqual(expect.objectContaining(testListing))
  })

  it('should not let an unauthorized user create a listing', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', 'Bearer ')
      .send(testListing)

    expect(response.status).toBe(401)
    expect(response.text).toBe('Authentication failed')
  })

  it('should not allow a logged in user create a listing with empty user_id field', async () => {
    const testListing = {
      user_id: '',
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"user_id" is not allowed to be empty')
  })

  it('should not allow a listing to be created with invalid user_id', async () => {
    const testListing = {
      user_id: 'kjfds98-lk321',
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"user_id" must be a valid GUID')
  })

  it('should not allow a logged in user create a listing without a title', async () => {
    const testListing = {
      user_id: user.id,
      title: '',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"title" is not allowed to be empty')
  })

  it('should now allow a logged in user create a listing without a description', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: '',
      price: 9500.25,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"description" is not allowed to be empty')
  })

  it('should not allow a logged in user create a listing without a price', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 0.0,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"price" must be greater than 0')
  })

  it('should not allow a logged in user to create a listing with negative price', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 0.0,
      picture_url:
        'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"price" must be greater than 0')
  })

  it('should not allow a logged in user create a listing without a picture', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url: ''
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"picture_url" is not allowed to be empty')
  })

  it('should not allow a logged in user to create a listing with invalid picture url', async () => {
    const testListing = {
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a good condition test bench.',
      price: 9500.25,
      picture_url: 'htps://invalid.url/lkjfsad'
    }

    const response = await supertest(app)
      .post('/api/listings/create')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(testListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe(
      '"picture_url" must be a valid uri with a scheme matching the http|https pattern'
    )
  })
})
