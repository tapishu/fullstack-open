
import { create } from 'zustand'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    updateVote: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdotesActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({anecdotes:[],filter:"",notification:""})
  vi.clearAllMocks()
})

describe("useactions",() => {
it("initilaze data from service", async() =>{
const mockAnecdotes =[{content:"test",id:1,votes:0}]
anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

const {result} = renderHook(()=> useAnecdotesActions())
    await act(async () => {
      await result.current.initialize()
    })
const {result:anecdotesResult }= renderHook(()=> useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)

}
)
it("Anecdotes sorted by acutual orders" , async()=>{
const anecdotes = [{
  content:"test1",id:1,votes:10
},{content:"test2",id:2,votes:100}]

useAnecdoteStore.setState({anecdotes})
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[1],anecdotes[0]])
})

it("Filter works", async() =>{
const  anecdotes = [{
  content:"testfilter",id:1,votes:10
},{content:"testnormal",id:2,votes:100}]
useAnecdoteStore.setState({anecdotes, filter:"filter"})
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[0]])
    expect(result.current).toHaveLength(1)
})

it("Vote works", async()=>{
const anecdotes =[{content:"test",id:1,votes:0}]
useAnecdoteStore.setState({anecdotes})
anecdoteService.updateVote.mockResolvedValue({ ...anecdotes[0], votes: 1})

    const { result } = renderHook(() => useAnecdotesActions())
    await act(async () => {
      await result.current.addVote(1)
    })

    const { result: anecdotesResult} = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)

})

})
