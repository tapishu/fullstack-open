import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotificationContext } from '../NotificationContext'

const Notification = () => {

  // 共有されている通知データ（文字列または null）を取り出す
const notification = useNotificationContext()
  
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

if (!notification) return null

  return(
<div data-testid="notification" style={style}>
      {notification}
    </div>)
}

export default Notification
