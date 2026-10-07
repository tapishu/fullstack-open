import { useAnecdotes } from '../hooks/useAnecdotes'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const AnecdoteForm = () => {

  const { addAnecdote } = useAnecdotes() 
const queryClient = useQueryClient()

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()

addAnecdote(content)  
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm