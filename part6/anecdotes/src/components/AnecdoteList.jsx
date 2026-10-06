
import { useAnecdotes, useAnecdotesActions} from "../store"



const  AnecdoteList= () => {
    
const anecdotes = useAnecdotes()
 const {addVote,removeAnecdotes} = useAnecdotesActions()

return(
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            {anecdote.votes === 0 &&
            <button onClick={() => removeAnecdotes(anecdote.id)}>delete</button>}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      </div>
)

}
export default AnecdoteList