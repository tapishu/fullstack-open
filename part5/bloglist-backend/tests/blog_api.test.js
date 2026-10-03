const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./list_helper')
const Blog = require('../models/blog')
const User = require("../models/user")
const bcrypt = require('bcrypt')


const api = supertest(app)// supertestに渡す

// beforeEach(async () => { //テストごとに毎回初期化
//   await Blog.deleteMany({})//Mongoose（MongoDBをNode.jsで操作するためのライブラリ）が用意しているデータベース操作の関数

//   for (const blog of helper.blogs) {
//     const blogObject = new Blog(blog)
//     await blogObject.save()
//   }
// })

let token = null

beforeEach(async () => {
    await User.deleteMany({})
  await Blog.deleteMany({})

 const passwordHash = await bcrypt.hash("salainen", 10)
 const user = new User({username: "root",passwordHash})
await user.save()

const loginResponse= await api
.post("/api/login")
.send({username: 'root', password: 'salainen' })

token = loginResponse.body.token

  await Blog.insertMany(helper.blogs)


})

test("Blogs are returned as json", async()=>{
    await api
        .get("/api/blogs")
        .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  // assert.strictEqual(response.body.length, 2)
  assert.strictEqual(response.body.length, helper.blogs.length)

})

test("blog has id property", async() =>{
    const response = await api.get("/api/blogs")

    const blogToCheck = response.body[0]

    assert.ok(blogToCheck.id)
    assert.strictEqual(blogToCheck._id, undefined)
})

test("blog can be added" , async()=>{
    const newBlog={
      title: 'I hate A',
      author: 'Shuta T',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/hatea.pdf',
      likes: 444,
    }

    await api
    .post("/api/blogs")
    .set("Authorization",`Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length +1)

    const authors = blogsAtEnd.map(n => n.author)
assert(authors.includes('Shuta T'))
})

test("fails without token", async()=>{
    const newBlog2={
      title: 'I hate A',
      author: 'Shuta T',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/hatea.pdf',
      likes: 444,
    }
    await api
    .post("/api/blogs")
    .send(newBlog2)
    .expect(401)
   
const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
})


test("blog can be added with likes 0" , async()=>{
    const newBlog={
      title: 'I hate G',
      author: 'Shuta Taka',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/hateG.pdf',
    }

    await api
    .post("/api/blogs")
    .set("Authorization",`Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b=>b.title ==="I hate G")
    assert.strictEqual(addedBlog.likes, 0)
})

test("Blog without title or URL", async()=>{
    const newBlog1={
      title: 'I hate G',
      author: 'Shuta Taka',
      //url: 'https://homepages.cwi.nl/~storm/teaching/reader/hateG.pdf',
    }
    const newBlog2={
  //    title: 'I hate G',
      author: 'Shuta Taka',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/hateG.pdf',
    }

    await api
    .post("/api/blogs")
    .set("Authorization",`Bearer ${token}`)
    .send(newBlog1)
    .expect(400)

    await api
    .post("/api/blogs")
    .set("Authorization",`Bearer ${token}`)
    .send(newBlog2)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
})

test("delete with 204 status", async ()=>{

    const newBlogtodelete = {
    title: 'Blog to delete',
    author: 'Tester',
    url: 'https://example.com/delete'
  }

    const response = await api.post("/api/blogs")
     .set("Authorization",`Bearer ${token}`)
    .send(newBlogtodelete)

  const blogToDelete = response.body

  const blogsAtStart = await helper.blogsInDb()

    await api.delete(`/api/blogs/${blogToDelete.id}`)
         .set("Authorization",`Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids= blogsAtEnd.map(b=>b.id)
    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length -1 )

})


test("To change the likes" , async()=>{
    const  blogsAtStart = await helper.blogsInDb()
    const blogToAddLike = blogsAtStart[0]

    const newBlog = {      
        title: blogToAddLike.title,
      author: blogToAddLike.author,
      url: blogToAddLike.url,
    likes: blogToAddLike.likes + 1,
    }
    const response = await api
    .put(`/api/blogs/${blogToAddLike.id}`)
    .send(newBlog)
    .expect(200)

assert.strictEqual(response.body.likes, blogToAddLike.likes + 1)
const blogsAtEnd = await helper.blogsInDb()
const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToAddLike.id)
assert.strictEqual(updatedBlog.likes, blogToAddLike.likes + 1)
})

describe("User related test", ()=>{
    beforeEach(async() =>{
        await User.deleteMany({})
       // await User.insertMany(helper.users)

        const passwordHash = await bcrypt.hash("salainen", 10)
        const user = new User({username: "root",passwordHash})

        await user.save()
    })
    
    test("creation user with minmun name or password", async() =>{
        const usersAtStart = await helper.usersInDb()

        const newUserInDb ={
        username: 'root',
      name: 'root',
      password: 'salainen',
        }

        const newUserWithMinName ={
        username: 'hi',
      name: 'hi',
      password: 'salainenyy',
        }

     const newUserWithMinPassword ={
        username: 'Luukkainen',
      name: 'Matti Luukkainen',
      password: 'sa',
        }

      const result1 =  await api
      .post('/api/users')
      .send(newUserInDb)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result1.body.error.includes('expected `username` to be unique'))

       const result2 = await api
      .post('/api/users')
      .send(newUserWithMinName)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result2.body.error.includes('username must be at least 3 character'))

    const result3 =  await api
      .post('/api/users')
      .send(newUserWithMinPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result3.body.error.includes('password must be at least 3 charact'))

      const usersAtEnd = await helper.usersInDb()
      
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

})

after(async () => {
  await mongoose.connection.close()
})
