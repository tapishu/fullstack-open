const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { syncModels } = require('./models') 
//userは複数んブログをもち、blogはユーザーに所有されるというデータベースを同期する際に
//順番に同期しないとおかしくなるためここで設定した順序でどうきするものをインポートし以下で使用

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/author')
const resetRouter = require('./controllers/reset')

app.use(express.json())
//データベース接続設定


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api', resetRouter)
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler) // ← ルート定義の「一番最後」に置くのがルール！

const start = async () => {
  await connectToDatabase()
  await syncModels()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()


// const note = Note.build(req.body)
// note.important = true
// await note.save()


// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
