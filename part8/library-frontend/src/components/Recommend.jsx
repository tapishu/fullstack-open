import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS,ME } from '../queries'

const Recommend = (props) => {

    const result_Me= useQuery(ME,{
                skip: !props.show,

    })

    //     if (result_Me.loading) {
    //   return <div>loading...</div>
    // }
    // if (result_Me.error) {
    //   return <div>Error!</div>
    // }
  const favoriteGenre = result_Me.data?.me?.favoriteGenre

        const result_Books= useQuery(ALL_BOOKS,{
          skip: !props.show,
          variables: { genre: favoriteGenre },
    })

          if (!props.show) {
    return null
  }
if (result_Me.loading || result_Books.loading) {
    return <div>loading...</div>
  }
  if (result_Me.error || result_Books.error) {
    return <div>Error!</div>
  }

const recommendBooks = result_Books.data.allBooks  
return (
    <div>
      <h2>recommendations books</h2>
<h4>books in your favorite genre</h4>
<h5>{favoriteGenre}</h5>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
