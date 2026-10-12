import {useNotificationContext} from "../NotificationContext"
 import { Alert, AppBar, Button } from '@mui/material'


const Notification = () => {

const notification = useNotificationContext()

  if (!notification) {
    return null
  }
  
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }


  return (
<div className={notification.type === 'error' ? 'error' : 'success'}>{notification.message}</div>

    // <div className={notification.type === 'success' ? 'success' : 'error'}>
    //   <Alert
    //     style={{ marginTop: 10, marginBottom: 10 }}
    //     severity={notification.type}
    //   >
    //     {notification.message}
    //   </Alert>
    // </div>
  )
}

export default Notification