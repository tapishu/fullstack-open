const router = require('express').Router()
const bcrypt = require('bcrypt') // 👈 bcryptをインポート
const { User, Blog,Reading_lists } = require('../models')

router.get('/', async (req, res) => {
  // const users = await User.findAll()
  // res.json(users)
    const users = await User.findAll({    
    include: {
      model: Blog
    }  
  })  
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

const user = await User.create({
      username,
      name,
      passwordHash
    })
    res.json(user)
  } catch(error) {
if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(err => err.message)
      return res.status(400).json({ error: messages }) // 👈 { error: [ ... ] } の形にする
    }
    return res.status(400).json({ error: error.message })
    }
})


router.put('/:username', async (req, res) => {
  try {
  const user = await User.findOne({
where: {username:req.params.username}
  })

if (user) {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } else {
      res.status(404).end() // ユーザーが見つからない場合は404
    }
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {

const where = {}
  if (req.query.search){
    where.read=req.query.search === 'true'
  }

  const user = await User.findByPk(req.params.id,{
    attributes:['name', 'username'] ,
    include:[{
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
          // 4. readingsの中間テーブル（reading_lists）の情報を消す（あるいは必要なものだけ残す）
          // 課題では「現時点ではブログが読まれているかどうか（read）に関する情報は必要ありません」とあるので、
          // through の attributes を空っぽにするか、あるいは読み取り状態を消せます
            attributes: ['read', 'id'],
            where 
          // 💡 ここに where 条件を渡すと、中間テーブル(reading_lists)のステータスで絞り込める！
        }
    }]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})





router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (user) {
      await user.destroy()
      res.status(204).end() // 削除成功時は中身なしで204を返す
    } else {
      res.status(404).json({ error: 'user not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
