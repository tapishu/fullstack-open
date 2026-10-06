import {useAnecdotesActions} from "../store"

const  AnecdoteForm= () => {
    
const {addAnecdotes} = useAnecdotesActions()
  const addAnecdote =(e) =>{
    e.preventDefault()
    const content= e.target.anecdote.value
    addAnecdotes(content)
        e.target.reset()  
  }
return(
    <div>
          <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
      </div>
)

}
export default AnecdoteForm
