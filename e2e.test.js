const request = require('supertest')
const app = require('./index')

describe('question repository', () => {
  let questionId
  let answerId
  test('GET /questions - 200', async () =>
    request(app).get('/questions').expect(200))

  test('GET /questions/:id - 404', async () =>
    request(app).get('/questions/dummy-id').expect(404))

  test('POST /questions - 201', async () =>
    request(app)
      .post('/questions')
      .send({ summary: 'summary', author: 'author' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined()
        questionId = body.id
      }))

  test('GET /questions/:id - 200', async () =>
    request(app).get(`/questions/${questionId}`).expect(200))

  test('GET /questions/:id/answers - 200', async () =>
    request(app).get(`/questions/${questionId}/answers`).expect(200))

  test('GET /questions/:id/answers - 404', async () =>
    request(app).get(`/questions/dummy-id/answers`).expect(404))

  test('GET /questions/:id/answers/:answerId - 404', async () =>
    request(app).get(`/questions/dummy-id/answers/dummy-answer-id`).expect(404))

  test('POST /questions/:id/answers - 201', async () =>
    request(app)
      .post(`/questions/${questionId}/answers`)
      .send({ summary: 'answer', author: 'author' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined()
        answerId = body.id
      }))

  test('GET /questions/:id/answers/:answerId - 200', async () => {
    return request(app)
      .get(`/questions/${questionId}/answers/${answerId}`)
      .expect(200)
  })
})
