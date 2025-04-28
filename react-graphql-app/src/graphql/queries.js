import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks($pagination: BookPaginationInput, $filters: BookFilterInput, $sort: BookSortInput) {
    getBooks(pagination: $pagination, filters: $filters, sort: $sort) {
      total
      books {
        id
        title
        author
        publishedYear
        category {
          id
          name
        }
        reviews {
          id
          content
          rating
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: Int!) {
    getBook(id: $id) {
      id
      title
      author
      publishedYear
      category {
        id
        name
      }
      reviews {
        id
        content
        rating
        userId
        username
        
      }
    }
  }
`;