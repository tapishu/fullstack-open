import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm' // ★追加
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import Notification from './components/Notification'
import {useBloglists} from "./hooks/useBloglists"
import {useUser} from "./UserContext"
import UserList from "./components/UserList"
import User from "./components/User"
import styled from 'styled-components'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import BlogList from './components/BlogList'
import { Container, Toolbar } from '@mui/material'
import { Alert, AppBar, Button } from '@mui/material'

// username: 'mluukkai',
// password: 'salainen'


const App = () => {

  const navigate = useNavigate() // ログイン完了後の画面遷移用

  const { blogs, isPending, isError,likeBlog,removeBlog } = useBloglists()
  const {user,users,logout} = useUser()


 const match = useMatch('/blogs/:id')
const blog = match ? blogs.find((b) => b.id === match.params.id) : null

const matchuser= useMatch("/users/:id")
const usershow = matchuser ? users.find((u)=> u.id ===matchuser.params.id) : null

    if (isPending) {
    return <div>loading data...</div>
  }
if (isError) {
    return <div>anecdote service not available due to problems in server</div>
  }


  const handleRemove = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (ok) {
removeBlog(blog)
        navigate('/')
    }

  }
 

  return (
    <Container>
      <div>
        <div>
          <AppBar position="static">
            <Toolbar>
              <div
                style={{ flexGrow: 1, fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                Blog App
              </div>
              {/* component={Link} と書くことで 「Material UI の見た目（デザイン）のまま、中身の挙動だけ React Router の <Link> として動かす」 */}
              <Button color="inherit" component={Link} to="/">
                blogs
              </Button>
              <Button color="inherit" component={Link} to="/users">
              users
              </Button>
              {user && (
                <Button color="inherit" component={Link} to="/create">
                  new blog
                </Button>
              )}
              {user ? (
                <Button color="inherit" onClick={logout}>
                  logout
                </Button>
              ) : (
                <Button color="inherit" component={Link} to="/login">
                  login
                </Button>
              )}
            </Toolbar>
          </AppBar>
           </div>
        <div>
          <ErrorBoundary>
            <Notification/>

            <Routes>
              <Route path="/" element={<BlogList blogs={blogs} />} />
              <Route path="/users" element={<UserList users={users} />} />
              <Route
                path="/login"
                element={<LoginForm/>}
              />
              <Route
                path="/create"
                element={<BlogForm/>}
              />

              <Route
                path="/blogs/:id"
                element={
                  <Blog
                    blog={blog}
                    handleLike={() => likeBlog(blog)}
                    handleRemove={() => handleRemove(blog)}
                    currentUser={user}
                  />
                }
              />
              <Route
              path="users/:id"
              element={<User user={usershow}/>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </Container>
  )
}

export default App
