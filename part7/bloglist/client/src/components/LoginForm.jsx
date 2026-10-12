import { TextField, Button } from '@mui/material'
import { useState } from 'react'
import {useUser} from "../UserContext"
import { useNavigate } from 'react-router-dom' 

// src/components/LoginForm.jsx
const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const {login} = useUser()
  const navigate = useNavigate() // 2. フックの呼び出し


  const handleSubmit=(event) =>{
event.preventDefault()
  login(username, password)
      navigate('/')
  }
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) =>
                      setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            value={password}
            onChange={({ target }) =>
                      setPassword(target.value)
                    }
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            style={{ marginTop: 10 }}
            color="primary"
          >
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
