import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input)
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
    }
  }
`;

export const ADD_BOOK = gql`
  mutation CreateBook($book: BookInput!) {
    createBook(book: $book) {
      id
      title
      author
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $book: BookInput!) {
    updateBook(id: $id, book: $book) {
      id
      title
      author
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($category: CategoryInput!) {
    createCategory(category: $category) {
      id
      name
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

export const WRITE_REVIEW = gql`
  mutation WriteReview($review: ReviewInput!) {
    writeReview(review: $review) {
      id
      content
      rating
      userId
      bookId
    }
  }
`;