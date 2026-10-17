
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS,EDIT_AUTHOR } from '../queries'


const Authors = (props) => {
const [name, setName] = useState("")
const [born, setBorn] = useState("")

const [changeBorn] = useMutation(EDIT_AUTHOR,{
      refetchQueries: [{ query: ALL_AUTHORS }],

})
const result_Authors= useQuery(ALL_AUTHORS)


  if (!props.show) {
    return null
  }

  if (result_Authors.loading) {
    return <div>loading...</div>
  }
  if (result_Authors.error) {
    return <div>Error!</div>
  }

const authors = result_Authors.data.allAuthors

const submit = (event)=>{
  event.preventDefault()
changeBorn({variables:{name, setBornTo:Number(born)}})
  setName("")
  setBorn("")
}
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
{ props.token &&(
  <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
      <div>
        name{/* name <input value ={name} onChange={({target})=>{setName(target.value)}} /> */}
      <select value ={name} onChange={({target})=>{setName(target.value)}}>
        {authors.map((a)=> (
          <option key={a.id} value={a.name}>{a.name}</option>
        ))}
        </select>
      </div>
      <div>
        born <input value={born} onChange={({target})=>{setBorn(target.value)}} />
      </div>
      <button type='submit'>update author</button>
      </form>
      </div>
      )
}
    </div>
  )
}

export default Authors
