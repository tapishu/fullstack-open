  
  import { gql } from '@apollo/client'

  export const ALL_AUTHORS = gql`
  query{
    allAuthors{
      name
      id
      born
      bookCount
    }
  }
`
 export const ALL_BOOKS = gql`
  query($genre: String){
    allBooks(genre:$genre){
      title
      published
      author {
        name
        id
        born
      }
      genres
      id
    }
  }
`
export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

 export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
$published:Int!
$author: String!
$genres: [String!]
  )
  {
    addBook(title:$title, published:$published, author:$author,genres:$genres){
      title
      published
      author {
        name
        id
        born
      }
      genres
      id
    }
  }
`
export const EDIT_AUTHOR = gql`
mutation editAuthor($name:String!, $setBornTo:Int!){
    editAuthor(name:$name, setBornTo:$setBornTo){
      name
      id
      born
      bookCount
    }
}

`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

//   editAuthor(
//     name:String!
//     setBornTo:Int!
//   ):Author