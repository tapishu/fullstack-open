import { TextField, Button } from '@mui/material'


// src/components/LoginForm.jsx
const LoginForm = (props) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={props.handleSubmit}>
        <div>
          <TextField
            label="username"
            value={props.username}
            onChange={props.handleUsernameChange}/>
        </div>
        <div>
          <TextField
            label ="password"
            value={props.password}
            onChange={props.handlePasswordChange}/>
        </div>
        {/* <div>
          <label>
            username
            <input
              type="text"
              value={props.username}
              onChange={props.handleUsernameChange}
            />
          </label>
        </div> */}
        {/* <div>
          <label>
            password
            <input
              type="password"
              value={props.password}
              onChange={props.handlePasswordChange}
            />
          </label>
        </div> */}
        <div>
          <Button type="submit" variant ="contained" style={{ marginTop: 10 }} color='primary'>login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
