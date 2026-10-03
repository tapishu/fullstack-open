import { useState } from 'react'
import { Container, Toolbar } from '@mui/material'
import { Alert,AppBar,Button,Paper } from '@mui/material'
const Blog = ({ blog, handleLike, handleRemove,currentUser }) => {


  if (!blog) {
    return null
  }
  // const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // const toggleVisibility = () => {
  //   setVisible(!visible)
  // }

  const showRemoveButton =
    blog.user &&
    currentUser &&
    (blog.user.username === currentUser.username)

  return(
<Paper elevation={1} style={{ padding: 24, marginTop: 20, marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8}}>
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
          </Button>        )}
        {showRemoveButton && (
<Button variant="outlined" color="error" onClick={handleRemove}>
            remove
          </Button>          )}
      </div>
      {/* )} */}
    </Paper>
  )
}
export default Blog