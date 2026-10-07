import { createContext, useState, useContext } from 'react'

const NotificationContext = createContext() //アプリ全体で共有したいデータを置くための「箱（Context）」を1つ作成する命令です。
//createContext() という関数を使って、「NotificationContext」という名前の共有スペースを定義

export const NotificationContextProvider = (props) => {
    //通知のデータをアプリ全体に届けるための『枠組み（Providerコンポーネント）をmainで使う。mainでAppにはさむことで全体が使用可能になる
  const [notification, setNotification] = useState(null)
//いま表示すべき通知メッセージ（初期値は null ＝ 何も表示しない）。


const notify = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={[notification, notify]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

// 通知の値を取り出すフック
export const useNotificationContext = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

// 通知を変更する関数（setNotification）を取り出すフック
export const useNotify = () => {
  const [, notify] = useContext(NotificationContext) //上記のプロバイダーで二つの変数を設定し、分割代入をしている。
  return notify
}

export default NotificationContext