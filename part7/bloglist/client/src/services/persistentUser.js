const STORAGE_KEY = 'loggedBlogAppUser'

const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

const getUser = () => {
  const loggedUserJSON = localStorage.getItem(STORAGE_KEY)
  if (loggedUserJSON) {
    return JSON.parse(loggedUserJSON)
  }
  return null
}

const removeUser = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export default {
  saveUser,
  getUser,
  removeUser
}