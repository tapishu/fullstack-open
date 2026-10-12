//import { useState } from 'react'
import { Container, TextField, Toolbar } from '@mui/material'
import { Alert, AppBar, Button, Paper } from '@mui/material'
import { useState } from 'react'
import {useBloglists} from "../hooks/useBloglists"

const Blog = ({ blog, handleLike, handleRemove, currentUser }) => {
const [comment, setComment] = useState("")

  const {addComment} = useBloglists()

  const handleCommentSubmit = (e) => {
    e.preventDefault() // ページの勝手なリロードを防ぐ！
    addComment(blog.id, comment) // コメントを追加
    setComment('') // 入力欄をクリアする
  }

  if (!blog) {
throw new Error()
  }
  if (!blog.user) {
  throw new Error()
}


  const showRemoveButton =
    blog.user && currentUser && blog.user.username === currentUser.username

  return (
    <Paper
      elevation={1}
      style={{ padding: 24, marginTop: 20, marginBottom: 20 }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>
        {blog.title}
        {/* <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button> */}
      </h2>
      <div style={{ color: '#555', marginBottom: 12, fontSize: '1.1rem' }}>
        by {blog.author}
      </div>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div style={{ color: '#666', marginBottom: 16 }}>
        Added by {blog.user?.name || blog.user?.username}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontWeight: 'bold' }}>{blog.likes} likes</span>

        {currentUser && (
          <Button variant="outlined" color="primary" onClick={handleLike}>
            like
          </Button>
        )}
        {showRemoveButton && (
          <Button variant="outlined" color="error" onClick={handleRemove}>
            remove
          </Button>
        )}
      </div>
      <div>
        <h4>Comments</h4>
<form onSubmit={handleCommentSubmit} style={{display:"flex", alignItems:"center", gap:10, marginTop: 10}}>
<TextField label = "comment"
value ={comment}
onChange={({target})=> setComment(target.value)}
/>
<Button           type="submit"
          variant="contained"
          style={{ height: 60 }}
          color="primary">Add Comment</Button>
</form>

        <ul>
          {blog.comments.map((c)=>(
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      {/* )} */}
    </Paper>
  )
}
export default Blog
