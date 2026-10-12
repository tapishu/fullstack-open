import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>404 - Page Not Found</h2>
      <p>There is no page</p>
      <Link to="/">Go back home</Link>
    </div>
  )
}
export default NotFound
