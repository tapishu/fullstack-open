import { useState,useEffect, createContext, useContext } from 'react'
import useAnecdotesSerVice from '../services/anecdotes'

const AnecdoteContext = createContext() //データ共有のcontext

//状態の一括管理
export const AnecdoteProvider = ({children})=>{
const [anecdotes,setAnecdotes] = useState([])

useEffect(()=>{
useAnecdotesSerVice.getAll().then(data =>{
  setAnecdotes(data)
})
},[])

const addAnecdote = (content)=>{
useAnecdotesSerVice.createNew(content).then(newAnecdote=>{
  setAnecdotes(anecdotes.concat(newAnecdote))
})
}

const deleteAnecdote =(id) =>{
  useAnecdotesSerVice.remove(id).then(()=>{
setAnecdotes(anecdotes.filter(a=>a.id !==id))
  }
  )
}
//配下からよべるようになる
return (
  <AnecdoteContext.Provider value={{
    anecdotes,
  addAnecdote,
  deleteAnecdote}}>
    {children}
  </AnecdoteContext.Provider>
)}

//コンポーネントが直接呼び出すカスタムフック。上記でnecdoteContext.Provider value={{の中のが使える。
export const useAnecdotes =()=>{
  return useContext(AnecdoteContext)
}

export const useField = (type) => { 
  const [value, setValue] = useState('')
  const onChange = (event) => {setValue(event.target.value)}
  const reset = ()=>{
        setValue("")
  }
  return {
    type,
    value,
    onChange,
    reset
  }
}
