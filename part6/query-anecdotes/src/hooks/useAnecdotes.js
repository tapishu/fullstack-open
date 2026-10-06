import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'

// Anecdotes
// anecdotes
// Anecdote
// anecdote
export const useAnecdotes = ()=>{
const queryClient = useQueryClient()

const result = useQuery({
    queryKey:["anecdotes"],
    queryFn:getAnecdotes,
refetchOnWindowFocus: false,
    retry: 1
})

const newAnecdoteMutation = useMutation({
mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }

})

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }

  })

return{
    anecdotes:result.data||[],
    isPending: result.isPending||result.isLoading,
    isError:result.isError,
addAnecdote: (content) => newAnecdoteMutation.mutate(content),
    voteAnecdote:(anecdote)=> updateAnecdoteMutation.mutate({
        ...anecdote, votes: anecdote.votes +1
    })
}

}