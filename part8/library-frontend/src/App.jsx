import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { useApolloClient, useQuery } from '@apollo/client/react'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('Library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }


    const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore() //Apollo Clientのキャッシュをリセット
  }
  const handleLogin =(newToken) =>{
    setToken(newToken)
    setPage("authors")
  }



  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('recommend')}>recommend</button>

        {token ? (
        <>
        <button onClick={() => setPage('add')}>add book</button>
                    <button onClick={onLogout}>logout</button>
                    </>): 
      (<button onClick={() => setPage("login")}>login</button>) }
      
      </div>

      <Authors show={page === 'authors'} token ={token}/>

      <Books show={page === 'books'} />
      <Recommend show={page === 'recommend'}/>

      <NewBook show={page === 'add'} />

      <LoginForm show={page ==="login"} setToken={handleLogin}
          setError={notify}/>
    </div>
  )
}

export default App
