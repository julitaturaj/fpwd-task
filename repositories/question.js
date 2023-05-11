const { readFile, writeFile } = require('fs/promises')
const { v4: uuid } = require('uuid')

const makeQuestionRepository = fileName => {
  const _getQuestionsFromFile = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    return JSON.parse(fileContent)
  }

  const _saveQuestionsToFile = async questions => {
    await writeFile(fileName, questions, { encoding: 'utf-8' })
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
    questions.push({ ...question, id: uuid() })
    await _saveQuestionsToFile(questions)
    return question
  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    return answers.find(({ id }) => id === answerId) || null
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await _getQuestionsFromFile()
    const questionToUpdate = questions.find(({ id }) => id === questionId)
    questionToUpdate.answers.push({ ...answer, id: uuid() })
    // answer saved in questions array by reference
    await _saveQuestionsToFile(questions)
    return answer
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
