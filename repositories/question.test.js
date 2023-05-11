const { writeFile, rm, readFile } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  const initQuestions = [
    {
      id: faker.datatype.uuid(),
      summary: 'What is my name?',
      author: 'Jack London',
      answers: [
        {
          id: faker.datatype.uuid(),
          summary: 'John Doe',
          author: 'John Doe'
        }
      ]
    },
    {
      id: faker.datatype.uuid(),
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    }
  ]
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('[getQuestions] should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('[getQuestions] should return a list of 2 questions', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(initQuestions))
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('[getQuestionById] should return question by id', async () => {
    const expectedQuestion = initQuestions[0]
    const returnedQuestion = await questionRepo.getQuestionById(
      expectedQuestion.id
    )
    expect(returnedQuestion.id).toEqual(expectedQuestion.id)
    expect(returnedQuestion.summary).toEqual(expectedQuestion.summary)
    expect(returnedQuestion.author).toEqual(expectedQuestion.author)
    expect(JSON.stringify(returnedQuestion.answers)).toEqual(
      JSON.stringify(expectedQuestion.answers)
    )
  })

  test('[getQuestionById] show return null', async () => {
    expect(
      await questionRepo.getQuestionById('it cannot be correct uuid')
    ).toBeNull()
  })

  test('[addQuestion] should add question to JSON file and return the same object', async () => {
    const newQuestion = {
      summary: 'How are you?',
      author: 'John Doe'
    }

    const returnedQuestion = await questionRepo.addQuestion(newQuestion)

    expect(returnedQuestion).not.toBeNull()
    expect(returnedQuestion.id).toBeDefined()
    expect(returnedQuestion.summary).toEqual(newQuestion.summary)
    expect(returnedQuestion.author).toEqual(newQuestion.author)

    const fileQuestions = JSON.parse(
      await readFile(TEST_QUESTIONS_FILE_PATH, {
        encoding: 'UTF-8'
      })
    )

    const fileQuestion = fileQuestions.find(
      ({ id }) => id === returnedQuestion.id
    )

    expect(fileQuestion).toBeDefined()
    expect(fileQuestion.id).toEqual(returnedQuestion.id)
    expect(fileQuestion.summary).toEqual(newQuestion.summary)
    expect(fileQuestion.author).toEqual(newQuestion.author)
  })

  test('[getAnswers] show return array of answers', async () => {
    const expectedQuestion = initQuestions[0]
    expect(
      JSON.stringify(await questionRepo.getAnswers(expectedQuestion.id))
    ).toEqual(JSON.stringify(expectedQuestion.answers))
  })

  test('[getAnswers] should return null', async () => {
    expect(
      await questionRepo.getAnswers('For sure it is not correct uuid')
    ).toBeNull()
  })

  test('[getAnswer] should return answer', async () => {
    const expectedQuestion = initQuestions[0]
    const expectedAnswer = expectedQuestion.answers[0]
    expect(
      JSON.stringify(
        await questionRepo.getAnswer(expectedQuestion.id, expectedAnswer.id)
      )
    ).toEqual(JSON.stringify(expectedAnswer))
  })

  test('[getAnswer] should return null', async () => {
    expect(
      await questionRepo.getAnswer('not correct uuid', 'same here')
    ).toBeNull()
  })

  test('[addAnswer] should add answer to JSON file and return the same object', async () => {
    const question = initQuestions[0]
    const newAnswer = {
      summary: 'Janush Novak',
      author: 'Janush Novak'
    }

    const returnedAnswer = await questionRepo.addAnswer(question.id, newAnswer)

    expect(returnedAnswer).toBeDefined()
    expect(returnedAnswer.id).toBeDefined()
    expect(returnedAnswer.summary).toEqual(newAnswer.summary)
    expect(returnedAnswer.author).toEqual(newAnswer.author)

    const fileQuestions = JSON.parse(
      await readFile(TEST_QUESTIONS_FILE_PATH, {
        encoding: 'UTF-8'
      })
    )

    const fileQuestion = fileQuestions.find(({ id }) => id === question.id)
    const fileAnswer = fileQuestion.answers.find(
      ({ id }) => id === returnedAnswer.id
    )

    expect(fileAnswer).toBeDefined()
    expect(fileAnswer.id).toEqual(returnedAnswer.id)
    expect(fileAnswer.summary).toEqual(returnedAnswer.summary)
    expect(fileAnswer.author).toEqual(returnedAnswer.author)
  })
})
