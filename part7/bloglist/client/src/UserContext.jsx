import { createContext,useState,useContext,useEffect } from "react";
import loginService from './services/login'
import { useNotify } from './NotificationContext'
import blogService from './services/blogs'
import userService from "./services/users"
import persistentUser from './services/persistentUser'



const UserContext = createContext()

export const UserContextProvider = (props)=>{

    const [user,setUser] = useState(null)
    const notify =useNotify()
    const [users, setUsers] = useState(null)



useEffect(() => {
    // ★ persistentUser 経由で取得
    const loggedUser = persistentUser.getUser()
    if (loggedUser) {
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

    useEffect(() => {
        const fetchUsers = async()=>{
            try{
            const data = await userService.listUser()
            setUsers(data)}
            catch(error){
                console.error('Failed to fetch users', error)
            }
        }
        fetchUsers()

  }, [])

    const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
    persistentUser.saveUser(user)   
    notify('login success', 'success')
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      notify('wrong credentials', 'error')
    }
  }

    const logout = () => {
    persistentUser.removeUser()
    setUser(null)
    blogService.setToken(null)
    notify('logged out', 'success')
  }


return(
    <UserContext.Provider value={{user,users, login, logout}}>
        {props.children}
    </UserContext.Provider>
)

}

export const useUser = () => {
  return useContext(UserContext)
}

export default UserContext