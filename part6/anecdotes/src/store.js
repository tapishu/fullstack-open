
import { create } from 'zustand'
import anecdoteService from "./services/anecdotes"

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set,get) => ({
  anecdotes: [],
      filter: '',
      notification: '', 
  actions: {
    removeAnecdotes: async(id)=>{
     const anecdote = get().anecdotes.find(a => a.id === id)
     if (!anecdote) return
     await anecdoteService.remove(id)
         set(
      state =>({
        anecdotes: state.anecdotes.filter(a=> a.id !==id)
      }))
    get().actions.setNotification(`you removed ${anecdote.content}`)

    },
    setNotification:(message, seconds = 5)=>{
      set({notification:message})
      setTimeout(()=>{
        set({notification:""})
      }, seconds * 1000)
    },

    addVote: async (id) =>{
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.updateVote(
        id, {...anecdote, votes: anecdote.votes +1}
      )
      set(state =>({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a) 
      }))
      get().actions.setNotification(`you voted '${anecdote.content}'`)
    },
    addAnecdotes: async(content) => {
    const response = await anecdoteService.createNew(content)
    set(
      state =>({
        anecdotes: state.anecdotes.concat(response)
      }))
    get().actions.setNotification(`you added ${response.content}`)
    }
,
    setFilter: value => set(() => ({ filter: value })),
    initialize: async()=>{
      const anecdotes = await anecdoteService.getAll()
      set(()=>({anecdotes}))
      //{ anecdotes } は、{ anecdotes: anecdotes } の短縮形です。
      //setを使わないと再描画されない
    }

  },
}))

//export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useAnecdotesActions = () => useAnecdoteStore((state) => state.actions)
export const useAnecdotes = () => {
const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  // 大文字・小文字を区別せずに includes でフィルタリング
  return anecdotes.filter(a => 
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
  .toSorted((a, b) => b.votes - a.votes )
}
export const useNotification = () => useAnecdoteStore((state) => state.notification)

export default useAnecdoteStore