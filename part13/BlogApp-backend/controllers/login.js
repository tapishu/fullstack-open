const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')


router.post('/', async (request, response) => {
const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }
//ここでいうトークンはuserForTokenにSERCRETで鍵をかけたもの。鍵をあけるとuserForTokenが出てくる
  const token = jwt.sign(userForToken, SECRET,
    { expiresIn: '2h' } // ← ここで有効期限を指定！
  )


await Session.create({
    userId: user.id,
    token: token // 発行したトークンをそのまま保存
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})


module.exports = router
