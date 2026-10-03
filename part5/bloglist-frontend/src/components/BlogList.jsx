import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const BlogList = ({ blogs }) => {

  return (
    <div>
      <h2>blogs</h2>

      <div className='blog-list'>
        {blogs
          .concat()
          .sort((a,b) => b.likes - a.likes)
          .map(blog =>
            <div key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} - {blog.author}
              </Link>
            </div>
          )}
      </div>
    </div>
  )
}
export default BlogList