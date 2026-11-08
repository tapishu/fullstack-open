const blogs = [
  { id: 1, title: "next.js utilizes React Server Components",     
    author: "HAkase",
    url: "http",
    likes:0


  },
  { id: 2, title: "next.js is built on top of React",     
    author: "HAkase2",
    url: "http",
    likes:0


  },
  {
    id: 3,
    title: "next.js supports both static and dynamic rendering",
    author: "HAkase3",
    url: "http",
    likes:0
  },
]



let nextId = 4

export const getBlogs = () => {
  return blogs
}

export const addBlog = (title: string, author: string,url: string,likes:number ) => {
  blogs.push({ id: nextId++, title, author,url,likes })
}

export const getBlogById = (id:number)=>{
  return blogs.find((blog)=> blog.id === id)
}
export const addLike = (id:number)=>{
  const blog = blogs.find((blog)=> blog.id === id)
  if(blog){
  blog.likes =  blog.likes + 1
  }
   
}