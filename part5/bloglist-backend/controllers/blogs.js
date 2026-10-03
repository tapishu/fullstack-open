const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user') 



blogsRouter.get('/', async (request, response) => {
const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body =  request.body
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  //const user = await User.findById(decodedToken.id)
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }
  if(!body.title || !body.url){
    return response.status(400).end()
  }

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
  })
 
  const savedBlog = await blog.save()
   user.blogs = user.blogs.concat(savedBlog._id)
   await user.save()
const populatedBlog = await Blog.findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete("/:id", async(request, response) => {
  const user = request.user
  // ログインしていない場合
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  // ブログの作成者 ID と ログインユーザーの ID を比較
  // Mongoose の ObjectId どうしを比較する場合は .toString() が必要！
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put("/:id", async(request, response) => {
  const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user:body.user?.id || body.user
  }
 const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
 .populate("user", {username:1, name:1})
  if(!updatedBlog){
            return response.status(404).end()
  } 
response.json(updatedBlog)
})


module.exports = blogsRouter
