import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable' // ★追加
import LoginForm from './components/LoginForm' // ★追加
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch,useNavigate
} from 'react-router-dom'
import BlogList from './components/BlogList'
import { Container, Toolbar } from '@mui/material'
import { Alert,AppBar,Button } from '@mui/material'


// username: 'mluukkai',
// password: 'salainen'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <div className={notification.type === 'success' ? 'success' : 'error'}>
      <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={notification.type}>
        {notification.message}
      </Alert>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  //const blogFormRef = useRef() // Togglableの開閉用
  const navigate = useNavigate() // ログイン完了後の画面遷移用

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 50000)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try{
      const user = await loginService.login({ username,password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      notify('login success', 'success')
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/') // ログイン成功したらトップ（ブログ一覧）へ遷移
    } catch {
      notify('wrong credentials', 'error')
    }
  }



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('log out with', username, password)
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    notify('logged out', 'success')
    navigate('/') // ログイン成功したらトップ（ブログ一覧）へ遷移

  }

  const handleCreateBlog = async (blogObject) => {
    // blogFormRef.current.toggleVisibility()
    try{
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
      navigate('/')
    } catch(exception){
      notify('failed to create blog', 'error')
      console.error(exception)
      navigate('/')
    }
  }

  const handleLike = async (blog) => {
    const updateBlog ={
      user :blog.user?.id || blog.user,
      likes : blog.likes+1,
      author : blog.author,
      title:blog.title,
      url: blog.url
    }
    try{
      const updatedBlog = await blogService.update(blog.id, updateBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog :b))
    } catch {
      notify('failed to like the blog', 'error')
    }
  }

  const handleRemove = async(blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if(ok){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))

      } catch{
        notify('failed to remove the blog', 'error')
      }
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  return (
    <Container>
      <div>
        <div>
          <AppBar position="static">
            <Toolbar>
              <div style={{ flexGrow: 1, fontSize: '1.25rem', fontWeight: 'bold' }}>
      Blog App
              </div>

              <Button color="inherit" component={Link} to ="/">blogs</Button>
              {user && <Button color="inherit" component={Link} to="/create">new blog</Button>}
              {user? (<Button color="inherit" onClick={handleLogout}>logout</Button>):
                (<Button color="inherit" component={Link} to="/login">login</Button>)}
            </Toolbar>
          </AppBar>
          {/* <Link to="/">blogs</Link>{' '}
        {user && (<Link to="/create">new blog</Link>)}{' '}
        {user?  (<button onClick={handleLogout}>logout</button>): (<Link to="/login">login</Link>)} */}
        </div>
        <div>
          <Notification notification={notification}/>

          <Routes>
            <Route path="/" element={<BlogList blogs={blogs} />} />
            <Route path="/login" element={<LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />}/>
            <Route path="/create" element={<BlogForm createBlog={handleCreateBlog}/>}/>


            <Route
              path="/blogs/:id"
              element={
                <Blog
                  blog={blog}
                  handleLike={() => handleLike(blog)}
                  handleRemove={() => handleRemove(blog)}
                  currentUser={user}
                />
              }
            />
          </Routes>
        </div>

      </div>
    </Container>
  )
}

export default App