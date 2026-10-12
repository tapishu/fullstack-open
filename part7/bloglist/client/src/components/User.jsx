//import { useState } from 'react'
import { Alert, AppBar, Button, Paper } from '@mui/material'


const User = ({ user }) => {
  if (!user) {
    return <div>User not found</div> // または null
  }


  return (
<div>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>
        {user.name || user.username}
        {/* <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button> */}
      </h2>
      {user.blogs.length ===0 ? (<div>No Blogs yet</div>) : 
      (<div>
      <h3>added blogs</h3>
      <ul>
      {user.blogs.map((b)=>(
        <li key={b.id}>{b.title}</li>
      )
      )}
      </ul>
      </div>
      )}

      <div>
      </div>
   
      </div>
  )
}
export default User
