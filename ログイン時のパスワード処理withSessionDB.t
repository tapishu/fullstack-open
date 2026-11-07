
npm install jsonwebtoken
npm install bcrypt

一つ前の方法に加えてDBにトークンを保存する方法
ログイン時にセッションDBへuseridとtokenを保存
ポスト時にはトークンがセッションDBに存在するのと一致している事を確認
ログアウト時は、トークンをデコードし、useridをわりだし、セッションDBからがいとうのuseridとtokenをdestroyさせる


####ログイン関連時にパスワードハッシュを行う方法###
Userデータベース上でハッシュかされたパスワードの保存
User作成のAPI POSTでusername,passwordを取得しパスワードのハッシュ化（bcrypt の使用）を行う
const saltRounds = 10
const passwordHash = await bcrypt.hash(password, saltRounds)
*生のパスワードは保存しない。saltRounds = 10 はハッシュ化の計算コスト（難易度）は高いほどいいらしい
const user = await User.create({
      username,
      name,
      passwordHash
    })
それをデータベースに保存

ログイン時のAPI
----
router.post('/', async (request, response) => {
const { username, password } = request.body

１.入力されたusernameを元にデータベースからレコードを探す
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  
2.ユーザーが存在するのであれば、入力されたパスワードをハッシュ化し、データベース上のハッシュ化されたパスワードと比較。
const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

3.ユーザーが存在し、パスワードがあっていれば、トークンの生成
  const userForToken = {
    username: user.username,
    id: user.id,
  }
//ここでいうトークンはuserForTokenにSERCRETで鍵をかけたもの。鍵をあけるとuserForTokenが出てくる
  const token = jwt.sign(userForToken, SECRET,
    { expiresIn: '2h' } // ← ここで有効期限を指定！
  )
//DBに反映
await Session.create({
    userId: user.id,
    token: token // 発行したトークンをそのまま保存
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
----
############################################

投稿時のチェック
############################################
const tokenExtractor = async  (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)

      // 1. データベースにそのセッション（トークン）が存在するか確認！
      const session = await Session.findOne({
        where: {
          userId: decodedToken.id,
          token: token
        }

      })
      if (!session) {
        return res.status(401).json({ error: 'token missing or invalid (logged out)' })
      }

    const user = await User.findByPk(decodedToken.id)
      if (!user || user.disabled) {
        return res.status(401).json({ error: 'account is disabled' })
      }

      req.user = user
      req.token = token // ログアウト時に使う用

    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/',tokenExtractor, async (req, res,next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)    
    const blog = await Blog.create({...req.body,userId: user.id})
    return res.json(blog)
  } catch(error) {
  next(error)
  }
})
############################################

ログアウト
############################################
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

############################################

