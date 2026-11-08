const router = require('express').Router()

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog,User, Session } = require('../models')
const { Op } = require('sequelize')
router.get('/', async (req, res) => {

  const where = {}

  // if (req.query.search){
  //   where.title={
  //           [Op.substring]: req.query.search
  //   //Sequelizeの演算子である Op.substring を使って、
  //   // 「title の文字列の中に、req.query.search の文字が部分的に含まれている（あいまい検索）」という条件を作って
  //   }
  // }
  if(req.query.search){
    where[Op.or]=[ //Orの条件を作成
      {
        title:{
            [Op.substring]: req.query.search
        }
      },
      {
        author:{
        [Op.substring]: req.query.search
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    //「ブログのデータのうち、userId 以外のカラムを全部取得する」
    include: {
      model: User,
      attributes: ['name']
    }, //このブログを書いたユーザー（Userモデル）の情報をJOIN（結合）して一緒に取得する
    where,
    order:[
      ["likes","DESC"]
    ]
  })  
   console.log(blogs.map(n=>n.toJSON())) //コレクションのばいいはmapでまわす
    console.log(JSON.stringify(blogs)) //こっちの方がいいかも

  res.json(blogs)

})

const blogFinder = async (req, res, next) => {
try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      return res.status(404).end()
    }
    next()
  } catch (error) {
    next(error) // エラーが起きたらミドルウェアへ流す
  }
}

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
        console.log(req.blog)    

        console.log(req.blog.toJSON())    
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

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

router.put('/:id', blogFinder, async (req, res,next) => {
try {
    req.blog.likes = req.body.likes
    await req.blog.save() 
    res.json(req.blog)
  } catch (error) {
    next(error) // ここでもエラーを受け渡す
  }
})

router.delete('/:id',tokenExtractor,blogFinder, async (req, res) => {
try {
  const loggedInUserId = req.decodedToken.id
  if (req.blog.userId !== loggedInUserId) {
      return res.status(403).json({ error: 'Unauthorized: you can only delete your own blogs' })
    }
    await req.blog.destroy() 
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
