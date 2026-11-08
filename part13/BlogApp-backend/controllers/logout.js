const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt') 
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7) //邪魔なbearer の七文字をカット
      req.decodedToken = jwt.verify(token, SECRET)
// { username: user.username,id: user.id}がでてくる

      req.token = token
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


// ログアウト・ルートのイメージ
router.delete('/', tokenExtractor, async (req, res) => {
  // tokenExtractor ミドルウェア等でリクエストからトークンとユーザー情報を取得している前提
  const user = req.decodedToken.id
  const token = req.token

  // データベースから該当するセッションを探して削除する
  await Session.destroy({
    where: {
      userId: user,
      token: token
    }
  })

  res.status(204).end()
})


module.exports = router
