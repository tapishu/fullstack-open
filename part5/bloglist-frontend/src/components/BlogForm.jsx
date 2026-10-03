import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm =({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const handleSubmit = (event) => {
    event.preventDefault()
    // 親（App）から渡された createBlog 関数に入力内容を渡す
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


        
  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <TextField
        label="title:"
              value={title}
              onChange={({ target }) => setTitle(target.value)}/>
        </div>
          <div>
        <TextField
        label="author:"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}/>
        </div>
          <div>
        <TextField
        label="url:"
              value={url}
              onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <Button type="submit" variant ="contained" style={{ marginTop: 10 }} color='primary'>create</Button>

      </form>
    </div>
  )
}
export default BlogForm