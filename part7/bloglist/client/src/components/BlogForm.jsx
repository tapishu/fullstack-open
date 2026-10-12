import { useState } from 'react'
import { TextField, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom' 
import {useBloglists} from "../hooks/useBloglists"

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const {addBlog} = useBloglists()
  const navigate = useNavigate() // 2. フックの呼び出し
  const handleSubmit = (event) => {
    event.preventDefault()
    // 親（App）から渡された createBlog 関数に入力内容を渡す
    addBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
<Paper style={{ padding: 20, width: "fit-content", display: "flex", flexDirection: "column", gap: 16 }}>        <div>
          <TextField
            label="title:"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label="author:"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="url:"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        </Paper>
        <Button
          type="submit"
          variant="contained"
style={{ marginTop: 10, alignSelf: 'flex-start' }}
          color="primary"
        >
          create
        </Button>
        
      </form>
    </div>
  )
}
export default BlogForm
