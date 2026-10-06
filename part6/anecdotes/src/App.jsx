import { useAnecdotes, useAnecdotesActions} from "./store"
import AnecdoteForm from "./components/AnecdoteForm"
import AnecdoteList from "./components/AnecdoteList"
import Filter from "./components/Filter"
import { useEffect } from "react"
      import Notification from "./components/Notification" 

    
const App = () => {
const {initialize} = useAnecdotesActions()

useEffect(()=>{
  initialize()
},[initialize])

  return (
    <div>
        <Notification/>
            <h2>Anecdotes</h2>
<AnecdoteList/>
<Filter/>
<AnecdoteForm/>
    </div>
  )
}

export default App
