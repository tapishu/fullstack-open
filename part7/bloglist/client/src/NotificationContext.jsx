
import { createContext, useState, useContext,useReducer } from 'react'


const NotificationContext = createContext() //アプリ全体で共有したいデータを置くための「箱（Context）」を1つ作成する命令です。
//createContext() という関数を使って、「NotificationContext」という名前の共有スペースを定義


//state: 値が変わったとき、Reactが自動的にそれを検知して
// 「画面を新しい情報に書き換えて（再レンダリングして）くれる」マジックボックス。
//ルールの策定
const notificationReducer = (state, action)=>{
    switch(action.type){
        case "SET_NOTIFICATION" :
            return action.payload
        case "CLEAR_NOTIFICATION":
            return null
        default:
            return state
    }
}

export const NotificationContextProvider = (props) => {

// const [notification, setNotification] = useState(null)

//useReducerを呼ぶ
const [state, dispatch] = useReducer(notificationReducer, null)


// dispatch({type:"SET_NOTIFICATION"})

const notify=(msg,type = "success") =>{
    dispatch({type:"SET_NOTIFICATION",payload: {message: msg, type:type}})
    setTimeout(()=>{
    dispatch({type:"CLEAR_NOTIFICATION"})
    },5000)
}
  return (
    <NotificationContext.Provider value={[state, notify]}>
        {props.children}
    </NotificationContext.Provider>

  )
}

export const useNotificationContext = ()=>{
    const [notification] = useContext(NotificationContext)
    return notification
}

export const useNotify =()=>{
    const [,notify] = useContext(NotificationContext)
    return notify
}



export default NotificationContext


