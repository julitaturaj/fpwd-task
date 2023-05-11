const { readFile, writeFile } = require('fs/promises')
const { v4: uuid } = require('uuid')

const makeQuestionRepository = fileName => {
  const _getQuestionsFromFile = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent)
  }

  const _saveQuestionsToFile = async questions => {
    await writeFile(fileName, JSON.stringify(questions), { encoding: 'utf-8' })
  }

  const getQuestions = () => {
    return _getQuestionsFromFile()
  }

  const getQuestionById = async questionId => {
    const questions = await _getQuestionsFromFile()
    return questions.find(({ id }) => id === questionId) || null
  }

  const addQuestion = async question => {
    const questions = await getQuestions()
    const newQuestion = {
      ...question,
      id: uuid(),
      answers: []
    }
    questions.push(newQuestion)
    await _saveQuestionsToFile(questions)
    return newQuestion
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    if (!question) {
      return null
    }
    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    if (!answers) {
      return null
    }
    return answers.find(({ id }) => id === answerId) || null
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await _getQuestionsFromFile()
    const questionToUpdate = questions.find(({ id }) => id === questionId)
    const newAnswer = { ...answer, id: uuid() }
    questionToUpdate.answers.push(newAnswer)
    // answer saved in questions array by reference
    await _saveQuestionsToFile(questions)
    return newAnswer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
