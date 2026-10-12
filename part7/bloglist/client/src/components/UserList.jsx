import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const UserList = ({users}) => {
  if(!users){
    return <div>loading users...</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper} style={{width:"fit-content"}}>
        <Table>
          <TableHead>
            <TableRow>
<TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
<TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
<TableCell style={{ fontWeight: 'bold' }}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                    {users.map((user)=>(
          <TableRow key ={user.id}>
            <TableCell>
      <Link to={`/users/${user.id}`}>{user.name || user.username}</Link>
      </TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default UserList
