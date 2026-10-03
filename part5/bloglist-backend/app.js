const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const app = express() 


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { family: 4 })

app.use(express.json())//送られてきたjsonリクエストをbodyにいれる
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)//トークンをとりだしてrequest.tokenにいれる
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
//request.tokenを解析し、ユーザーを探し、request.userにセットする
app.use('/api/users', usersRouter) 
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

