const router = require('express').Router()
const { User, Blog,Reading_lists} = require('../models')


router.post('/', async (req, res) => {
  try {
    const { blogId, userId} = req.body

const user = await User.findByPk(userId)
const blog = await Blog.findByPk(blogId)
if (!user) {
      return res.status(400).json({ error: 'Invalid userId: user does not exist' })
    }
if (!blog) {
      return res.status(400).json({ error: 'Invalid blogId: blog does not exist' })
    }

const readingBlog = await Reading_lists.create({
blogId,
userId
    })
    res.json(readingBlog)
  } catch(error) {
if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map(err => err.message)
      return res.status(400).json({ error: messages }) // 👈 { error: [ ... ] } の形にする
    }
    return res.status(400).json({ error: error.message })
    }
})


router.put('/:id', async (req, res,next) => {
try {
    const readingBlog = await Reading_lists.findByPk(req.params.id)
    if(!readingBlog){
            return res.status(404).json({ error: 'Invalid Id: Id does not exist' })
    }

    readingBlog.read = req.body.read

    await readingBlog.save() 
    res.json(readingBlog)
  } catch (error) {
    next(error) // ここでもエラーを受け渡す
  }
})


module.exports = router
