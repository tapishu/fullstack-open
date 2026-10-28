import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
    edges {
      cursor
      node {
        id
        fullName
        language
        ratingAverage
        reviewCount
        stargazersCount
        forksCount
        description
        ownerAvatarUrl
      }
    }
        }
  }
`;

export const USERLOGIN = gql`
mutation Authenticate($username: String!, $password: String!) {
    authenticate(credentials: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

export const ME = gql`
query Query {
  me {
    id
    username
  }
}
`;

// other queries...