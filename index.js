const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

const validateAnswerOrQuestion = body => {
  const errors = []
  if (!body.summary || typeof body.summary !== 'string')
    errors.push('Summary should be provided in request body as string')

  if (!body.author || typeof body.author !== 'string')
    errors.push('Author should be provided in request body as string')

  if (errors.length) {
    throw new Error(errors.join(', '), { httpCode: 400 })
  }
}

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  if (question) {
    res.json(question)
  } else {
    throw new Error('Question not found', { httpCode: 404 })
  }
})

app.post('/questions', async (req, res) => {
  validateAnswerOrQuestion(req.body)
  const newQuestion = await req.repositories.questionRepo.addQuestion(req.body)
  res.status(201).json(newQuestion)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  res.json(answers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  validateAnswerOrQuestion(req.body)
  const newAnswer = await req.repositories.questionRepo.addAnswer(
    req.params.questionId,
    req.body
  )
  res.status(201).json(newAnswer)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswerById(
    req.params.questionId,
    req.params.answerId
  )
  if (answer) {
    res.json(answer)
  } else {
    throw new Error('Answer not found', { httpCode: 404 })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.httpCode || 500).send(err.message || 'Unexpected Error')
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
