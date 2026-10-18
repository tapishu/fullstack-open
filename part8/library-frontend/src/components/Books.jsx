import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
const [showGenre, setShowGenre] = useState("all genres")
const showGenres =["all genres"]


    const result_Books= useQuery(ALL_BOOKS,{
          skip: !props.show,

    })
    const result_Books_Genere= useQuery(ALL_BOOKS,{
          skip: !props.show,
          variables: { genre: showGenre === "all genres" ? null : showGenre }
          //variables: { genre: "crime" }

    })


  if (!props.show) {
    return null
  }


    if (result_Books.loading || result_Books_Genere.loading) {
      return <div>loading...</div>
    }
    if (result_Books.error||result_Books_Genere.error) {
      return <div>Error!</div>
    }
  
const books = result_Books.data.allBooks

  books.forEach((book)=>{
book.genres.forEach((genre)=>{
  if(!showGenres.includes(genre)){
    showGenres.push(genre)
  }
})
  })
  const showBooks = result_Books_Genere.data.allBooks

  //ボタンにして、押されたらそのジャンルで絞ったクエリーを読んで、booksに上書きするべき？
  return (
    <div>
      <h2>books</h2>
      {showGenre === "all genres" ? (<h3>All genres</h3>) : (<h3>in genre {showGenre}</h3>)}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {showBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showGenres.map((g)=>
      (<button key={g} onClick={() => setShowGenre(g)}>{g}</button>)
      )}
    </div>
  )
}

export default Books
