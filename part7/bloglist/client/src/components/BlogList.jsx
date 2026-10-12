import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const BlogList = ({ blogs }) => {
  //throw new Error('simulated error')

  return (
    <div>
      <h2>Blogs</h2>

      
        <TableContainer className="blog-list" component={Paper} style={{width:"fit-content"}}>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }} >Title</TableCell>
             <TableCell style={{ fontWeight: 'bold' }}>Author</TableCell>
             <TableCell style={{ fontWeight: 'bold' }}>Likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {blogs
          .concat()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
              </TableCell>
         <TableCell>{blog.author}</TableCell>
                  <TableCell>{blog.likes}</TableCell>

            </TableRow>
             ))}
          </TableBody>
          </Table>
        </TableContainer>
      
    </div>
  )
}
export default BlogList
