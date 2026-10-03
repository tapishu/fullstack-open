const _ = require('lodash')
const Blog = require('../models/blog')
const User = require("../models/user")

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]


const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const dummy = (blogs) => {
return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) =>{
  if(blogs.length ===0){
    return null
  }
  const favorite = blogs.reduce((prev,current) =>{
    return (prev.likes > current.likes) ? prev:current
  }
)
return {
  title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
}
}

const mostBlogs = (blogs) =>{
  if(blogs.length ===0){
    return null
  }
const blogsCount = _.countBy(blogs, 'author')
//authorごとのカウント

let maxAuthor =""
let maxBlogs =0

for(const author in blogsCount){
  if(blogsCount[author] > maxBlogs){
    maxAuthor=author
maxBlogs=blogsCount[author]
  }
}
return {
    author: maxAuthor,
    blogs: maxBlogs
}
}

const mostLikes =(blogs)=>{
    if(blogs.length ===0){
    return null
  }
  const likesCount = _.groupBy(blogs,"author")
//{ 'Edsger W. Dijkstra': [ {likes: 5}, {likes: 12} ],
let maxAuthor =""
let maxLikes =0

for(const author in likesCount){
  const totalLikes = likesCount[author].reduce((sum,blog) => sum + blog.likes,0)
  if (totalLikes > maxLikes){
maxAuthor = author
maxLikes=totalLikes
  }
}
return {
  author:maxAuthor,
  likes: maxLikes
}
}

const blogsInDb = async () =>{
  const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() =>{
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  listWithOneBlog,
  blogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  usersInDb
}