import axios from 'axios'
const baseUrl = '/api/users'

const listUser = async () => {
  const response = await axios.get(baseUrl)
  return response.data
  }

export default { listUser }
