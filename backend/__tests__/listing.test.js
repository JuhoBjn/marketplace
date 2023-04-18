const {
  describe,
  it,
  beforeAll,
  afterAll,
  expect,
  beforeEach,
  afterEach
} = require('@jest/globals')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: genUuid } = require('uuid')

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

describe('Update listing endpoint', () => {
  const user = {}
  let listing = {}

  beforeAll(() => {
    return new Promise((resolve, reject) => {
      // Sign up a test user.
      const testUser = {
        id: genUuid(),
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
            if (err) {
              connection.release()
              return reject(err)
            }
          })

          // Create a test listing to update.
          const testListing = {
            id: genUuid(),
            user_id: testUser.id,
            title: 'Test bnch',
            description: 'Selling a good condition test bench',
            price: 9200.0,
            picture_url:
              'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
          }
          const insertListingQuery = 'INSERT INTO listings SET ?;'
          connection.query(insertListingQuery, [testListing], (err, result) => {
            connection.release()
            if (err) return reject(err)
            listing = testListing
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

        // Delete test listing.
        const deleteQuery = 'DELETE FROM listings WHERE id=?;'
        connection.query(deleteQuery, [listing.id], (err, result) => {
          if (err) {
            connection.release()
            return reject(err)
          }
        })

        // Delete test user.
        const deleteUserQuery = 'DELETE FROM users WHERE id=?;'
        connection.query(deleteUserQuery, [user.id], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    })
  })

  it('should allow a logged in user to update their own listing', async () => {
    const updatedListing = {
      id: listing.id,
      user_id: listing.user_id,
      title: 'Test bench',
      description: 'Selling a used test bench in good shape.',
      price: 9100,
      picture_url: listing.picture_url
    }

    const response = await supertest(app)
      .put('/api/listings/update')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedListing)

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toEqual(expect.objectContaining(updatedListing))
  })

  it("should not allow a user to update someone else's listing", async () => {
    const updatedListing = {
      id: listing.id,
      user_id: '1c141505-3002-4911-90aa-22bc4878335f',
      title: 'Test bench',
      description: 'Selling a used test bench in good shape.',
      price: 9100,
      picture_url: listing.picture_url
    }

    const response = await supertest(app)
      .put('/api/listings/update')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedListing)

    expect(response.status).toBe(403)
    expect(response.text).toBe("Cannot update someone else's listing")
  })

  it('should not allow an unauthenticated user to update a listing', async () => {
    const updatedListing = {
      id: listing.id,
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a used test bench in good shape.',
      price: 9100,
      picture_url: listing.picture_url
    }

    const response = await supertest(app)
      .put('/api/listings/update')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .send(updatedListing)

    expect(response.status).toBe(401)
    expect(response.text).toBe('Authentication failed')
  })

  it('should not allow updating a listing with no provided listing id', async () => {
    const updatedListing = {
      id: '',
      user_id: user.id,
      title: 'Test bench',
      description: 'Selling a used test bench in good shape.',
      price: 9100,
      picture_url: listing.picture_url
    }

    const response = await supertest(app)
      .put('/api/listings/update')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"id" is not allowed to be empty')
  })

  it('should not allow updating a listing with no provided user id', async () => {
    const updatedListing = {
      id: listing.id,
      user_id: '',
      title: 'Test bench',
      description: 'Selling a used test bench in good shape.',
      price: 9100,
      picture_url: listing.picture_url
    }

    const response = await supertest(app)
      .put('/api/listings/update')
      .set('Accept', 'application/json')
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedListing)

    expect(response.status).toBe(400)
    expect(response.text).toBe('"user_id" is not allowed to be empty')
  })
})

describe('Fetch listings endpoints', () => {
  let user
  const listings = []
  let otherUser
  let otherUsersListing

  beforeAll(() => {
    return new Promise((resolve, reject) => {
      // Sign up a test user.
      user = {
        id: genUuid(),
        firstname: 'Timmy',
        lastname: 'Test',
        email: 'timmy@test.com',
        phone: '0123456789',
        password: 'timmy@test.com'
      }
      bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return reject(err)
        user.password = hash

        pool.getConnection((err, connection) => {
          if (err) return reject(err)
          const insertQuery = 'INSERT INTO users SET ?;'
          connection.query(insertQuery, [user], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })

          // Create test listings.
          listings.push(
            {
              id: genUuid(),
              user_id: user.id,
              title: 'Test bench',
              description: 'Selling a good condition test bench',
              price: 9200.0,
              picture_url:
                'https://cdn10.picryl.com/photo/1984/05/24/a-view-of-laboratory-equipment-used-for-laser-testing-at-the-verona-test-site-08ed51-1600.jpg'
            },
            {
              id: genUuid(),
              user_id: user.id,
              title: 'Cucumber moped',
              description:
                'Selling my cucumber moped. Good condition, no lowballs.',
              price: 200.0,
              picture_url:
                'https://im.mtvuutiset.fi/image/7481386/landscape16_9/1024/576/e20bb1dea888345bbfb5a710a53f4f3d/DA/kurkkumopo.jpg'
            },
            {
              id: genUuid(),
              user_id: user.id,
              title: 'Snake oil',
              description:
                'A guaranteed cure for rheumatism whether acute, chronic, sciatic, neuralgic or inflammatory.',
              price: 600.0,
              picture_url:
                'https://openclipart.org/download/275671/yaquissnakeoilkinetoons.svg'
            }
          )

          const insertListingQuery = 'INSERT INTO listings SET ?;'
          connection.query(insertListingQuery, [listings[0]], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })
          connection.query(insertListingQuery, [listings[1]], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })
          connection.query(insertListingQuery, [listings[2]], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })
        })

        // Create other test user.
        otherUser = {
          id: genUuid(),
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@doe.com',
          phone: '9876543210',
          password: 'john@doe1234'
        }

        bcrypt.hash(otherUser.password, 10, (err, hash) => {
          if (err) return reject(err)
          otherUser.password = hash

          pool.getConnection((err, connection) => {
            if (err) return reject(err)
            const insertQuery = 'INSERT INTO users SET ?;'
            connection.query(insertQuery, [otherUser], (err, result) => {
              if (err) {
                connection.release()
                return reject(err)
              }
            })

            // Create listing for other test user.
            otherUsersListing = {
              id: genUuid(),
              user_id: otherUser.id,
              title: 'Floor lamp',
              description:
                "Redesigning my house, so I'm selling my old floor lamp as it doesn't suit the new style.",
              price: 75.5,
              picture_url:
                'https://upload.wikimedia.org/wikipedia/commons/e/eb/Floor_Lamp_MET_DT8293.jpg'
            }
            const otherUsersListingInsertQuery = 'INSERT INTO listings SET ?;'
            connection.query(
              otherUsersListingInsertQuery,
              [otherUsersListing],
              (err, result) => {
                connection.release()
                if (err) return reject(err)
                resolve(result)
              }
            )
          })
        })
      })
    })
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)

        const deleteListingsQuery = 'DELETE FROM listings WHERE id=?;'
        connection.query(
          deleteListingsQuery,
          [listings[0].id],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )
        connection.query(
          deleteListingsQuery,
          [listings[1].id],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )
        connection.query(
          deleteListingsQuery,
          [listings[2].id],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )
        connection.query(
          deleteListingsQuery,
          [otherUsersListing.id],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )

        const deleteUserQuery = 'DELETE FROM users WHERE id=?;'
        connection.query(deleteUserQuery, [user.id], (err, result) => {
          if (err) {
            connection.release()
            return reject(err)
          }
        })
        connection.query(deleteUserQuery, [otherUser.id], (err, result) => {
          connection.release()
          if (err) {
            return reject(err)
          }
          resolve(result)
        })
      })
    })
  })

  it('should return all listings in json format', async () => {
    const response = await supertest(app)
      .get('/api/listings')
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: listings[0].id,
          user_id: listings[0].user_id,
          title: listings[0].title,
          description: listings[0].description,
          price: `${listings[0].price}.00`,
          picture_url: listings[0].picture_url,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone
        })
      ])
    )
  })

  it('should return all of one users posts in json format', async () => {
    const response = await supertest(app)
      .get(`/api/listings/${user.id}`)
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: listings[0].id,
          user_id: listings[0].user_id,
          title: listings[0].title,
          description: listings[0].description,
          price: `${listings[0].price}.00`,
          picture_url: listings[0].picture_url,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone
        }),
        expect.not.objectContaining({
          id: otherUsersListing.id,
          user_id: otherUsersListing.user_id,
          title: otherUsersListing.title,
          description: otherUsersListing.description,
          price: `${otherUsersListing.price}.00`,
          picture_url: otherUsersListing.picture_url,
          firstname: otherUser.firstname,
          lastname: otherUser.lastname,
          email: otherUser.email,
          phone: otherUser.phone
        })
      ])
    )
  })

  it('should not fetch listings for invalid user id', async () => {
    const response = await supertest(app)
      .get('/api/listings/lkajsdf9080324lsafd')
      .set('Accept', 'application/json')

    expect(response.status).toBe(400)
    expect(response.text).toBe('"userId" must be a valid GUID')
  })
})

describe('Delete listing endpoint', () => {
  const user = {}
  let listing

  let otherUserId
  let otherUsersListingId

  beforeEach(() => {
    return new Promise((resolve, reject) => {
      const testUser = {
        id: genUuid(),
        firstname: 'Tina',
        lastname: 'Tester',
        email: 'tina@tester.com',
        phone: '9874563210',
        password: 'tina@tester12345'
      }

      bcrypt.hash(testUser.password, 10, (err, hash) => {
        if (err) return reject(err)
        testUser.password = hash
        pool.getConnection((err, connection) => {
          if (err) return reject(err)

          const insertQuery = 'INSERT INTO users SET ?;'
          connection.query(insertQuery, [testUser], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })

          listing = {
            id: genUuid(),
            user_id: testUser.id,
            title: 'Grandfather clock',
            description:
              'My neighbor did not appreciate my new grandfather clock.',
            price: 200,
            picture_url:
              'https://live.staticflickr.com/208/490029373_e13942a0b4_b.jpg'
          }

          const insertListingQuery = 'INSERT INTO listings SET ?;'
          connection.query(insertListingQuery, [listing], (err, result) => {
            connection.release()
            if (err) return reject(err)
          })
        })
      })

      user.id = testUser.id
      user.email = testUser.email
      user.token = jwt.sign(testUser, process.env.JWT_KEY)

      const otherTestUser = {
        id: genUuid(),
        firstname: 'Anthony',
        lastname: 'Other',
        email: 'anthony@other.com',
        phone: '1236547890',
        password: 'anthony@other12345'
      }
      otherUserId = otherTestUser.id

      bcrypt.hash(otherTestUser.password, 10, (err, hash) => {
        if (err) return reject(err)
        otherTestUser.password = hash

        pool.getConnection((err, connection) => {
          if (err) return reject(err)

          const insertUserQuery = 'INSERT INTO users SET ?;'
          connection.query(insertUserQuery, [otherTestUser], (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          })

          const otherTestUsersListing = {
            id: genUuid(),
            user_id: otherTestUser.id,
            title: 'Honda factory head unit',
            description:
              "Swapped a new head unit into my car, so I'm selling the old one",
            price: 20,
            picture_url: 'https://m.media-amazon.com/images/I/81hG0TvLlLL.jpg'
          }
          otherUsersListingId = otherTestUsersListing.id

          const insertListingQuery = 'INSERT INTO listings SET ?;'
          connection.query(
            insertListingQuery,
            [otherTestUsersListing],
            (err, result) => {
              connection.release()
              if (err) return reject(err)
              resolve(result)
            }
          )
        })
      })
    })
  })

  afterEach(() => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) return reject(err)

        const deleteListingQuery = 'DELETE FROM listings WHERE id=?;'
        connection.query(deleteListingQuery, [listing.id], (err, result) => {
          if (err) {
            connection.release()
            return reject(err)
          }
        })

        connection.query(
          deleteListingQuery,
          [otherUsersListingId],
          (err, result) => {
            if (err) {
              connection.release()
              return reject(err)
            }
          }
        )

        const deleteUserQuery = 'DELETE FROM users WHERE id=?;'
        connection.query(deleteUserQuery, [user.id], (err, result) => {
          connection.release()
          if (err) {
            connection.release()
            return reject(err)
          }
        })

        connection.query(deleteUserQuery, [otherUserId], (err, result) => {
          connection.release()
          if (err) return reject(err)
          resolve(result)
        })
      })
    })
  })

  it('should allow a logged in user to delete their own listing', async () => {
    const response = await supertest(app)
      .delete(`/api/listings/${listing.id}`)
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ user_id: user.id })

    // Check that the listing was deleted.
    let fetchedListing
    pool.getConnection((err, connection) => {
      if (err) return console.log(err)
      const selectQuery = 'SELECT * FROM listings WHERE id=?;'
      connection.query(selectQuery, [listing.id], (err, result) => {
        connection.release()
        if (err) return console.log(err)
        fetchedListing = result
      })
    })

    expect(response.status).toBe(200)
    expect(response.text).toBe('Listing deleted successfully')
    expect(fetchedListing).toBeFalsy()
  })

  it("should not allow a logged in user to delete another user's listing", async () => {
    const response = await supertest(app)
      .delete(`/api/listings/${otherUsersListingId}`)
      .set('Content', 'application/json')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ user_id: user.id })

    expect(response.status).toBe(401)
    expect(response.text).toBe("Cannot delete another user's listing")
  })

  it('should not allow an unregistered user to delete a listing', async () => {
    const response = await supertest(app).delete(`/api/listings/${listing.id}`)

    expect(response.status).toBe(401)
    expect(response.text).toBe('Authentication failed')
  })
})
