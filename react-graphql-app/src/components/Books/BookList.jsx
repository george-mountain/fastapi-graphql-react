
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOKS, GET_CATEGORIES } from '../../graphql/queries';
import { ADD_BOOK, DELETE_BOOK, CREATE_CATEGORY } from '../../graphql/mutations';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Dropdown,
  Image,
  Badge,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faChevronDown,
  faSort,
  faPlus,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../Layout';
import { Link } from 'react-router-dom';

const BookList = () => {
  // State management
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Date Added (Newest)');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category_id: '',
    published_year: new Date().getFullYear(),
    cover_url: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [successMessage, setSuccessMessage] = useState('');

  // GraphQL queries
  const { 
    loading: booksLoading, 
    error: booksError, 
    data: booksData, 
    refetch: refetchBooks 
  } = useQuery(GET_BOOKS, {
    variables: {
      filters: selectedCategory !== 'All Categories' ? { categoryId: parseInt(selectedCategory) } : null,
      sort: sortBy === 'Title (A-Z)' ? { field: 'title', order: 'asc' } :
            sortBy === 'Author (A-Z)' ? { field: 'author', order: 'asc' } :
            sortBy === 'Date Added (Newest)' ? { field: 'published_year', order: 'desc' } :
            null
    }
  });

  const { 
    loading: categoriesLoading, 
    error: categoriesError, 
    data: categoriesData 
  } = useQuery(GET_CATEGORIES);

  // GraphQL mutations
  const [addBook] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setSuccessMessage('Book added successfully!');
      setShowAddBookForm(false);
      refetchBooks();
    },
    onError: (error) => {
      if (error.message.includes('Authentication required')) {
        alert('You must be logged in to add a book.');
        window.location.href = '/login';
      } else {
        console.error('Error adding book:', error);
      }
    },
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      setSuccessMessage('Book deleted successfully!');
      setShowDeleteModal(false);
      refetchBooks();
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
    }
  });

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      setSuccessMessage('Category added successfully!');
      setNewCategory({ name: '' });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
    }
  });

  // Effect to clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handler functions for filter and sort
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    refetchBooks({
      filters: category !== 'All Categories' ? { categoryId: parseInt(category) } : null
    });
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    refetchBooks({
      sort: sortOption === 'Title (A-Z)' ? { field: 'title', order: 'asc' } :
            sortOption === 'Author (A-Z)' ? { field: 'author', order: 'asc' } :
            sortOption === 'Date Added (Newest)' ? { field: 'published_year', order: 'desc' } :
            null
    });
  };

  // Handler functions
  const handleAddBook = (e) => {
    e.preventDefault();
    addBook({
      variables: {
        book: {
          title: newBook.title,
          author: newBook.author,
          categoryId: parseInt(newBook.category_id),
          publishedYear: parseInt(newBook.published_year),
          ...(newBook.cover_url && { cover_url: newBook.cover_url })
        }
      }
    });
  };

  const handleDeleteBook = () => {
    deleteBook({ variables: { id: bookToDelete } });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    createCategory({ variables: { category: { name: newCategory.name } } });
  };

  const getCategoryBadgeColor = (category) => {
    switch (category?.name) {
      case 'Fiction': return 'primary';
      case 'Science': return 'success';
      case 'Non-Fiction': return 'warning';
      default: return 'secondary';
    }
  };

  if (booksLoading || categoriesLoading) return (
    <Layout>
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </Layout>
  );

  if (booksError) return (
    <Layout>
      <Alert variant="danger" className="my-5">Error loading books: {booksError.message}</Alert>
    </Layout>
  );

  if (categoriesError) return (
    <Layout>
      <Alert variant="danger" className="my-5">Error loading categories: {categoriesError.message}</Alert>
    </Layout>
  );

  return (
    <Layout background={false}>
      <div className="container py-4">
        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" className="mt-3" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Header */}
        <header className="mb-5">
          <h1 className="display-5 fw-bold text-dark">My Bookshelf</h1>
          <p className="text-muted">Your personal book management dashboard</p>
        </header>

        <Row>
          {/* Main Content Column */}
          <Col lg={8} className="pe-lg-4">
            {/* Filter/Sort/Add Book Bar */}
            <Card className="mb-4 shadow-sm">
              <Card.Body className="d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex flex-wrap gap-2">
                  {/* Filter Dropdown */}
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="filter-dropdown">
                      <FontAwesomeIcon icon={faFilter} className="me-2" />
                      Filter
                      <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item active={selectedCategory === 'All Categories'} onClick={() => handleFilterChange('All Categories')}>
                        All Categories
                      </Dropdown.Item>
                      {categoriesData?.getCategories.map(category => (
                        <Dropdown.Item 
                          key={category.id}
                          active={selectedCategory === category.name}
                          onClick={() => handleFilterChange(category.id)}
                        >
                          {category.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Sort Dropdown */}
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="sort-dropdown">
                      <FontAwesomeIcon icon={faSort} className="me-2" />
                      {sortBy}
                      <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item active={sortBy === 'Title (A-Z)'} onClick={() => handleSortChange('Title (A-Z)')}>
                        Title (A-Z)
                      </Dropdown.Item>
                      <Dropdown.Item active={sortBy === 'Author (A-Z)'} onClick={() => handleSortChange('Author (A-Z)')}>
                        Author (A-Z)
                      </Dropdown.Item>
                      <Dropdown.Item active={sortBy === 'Date Added (Newest)'} onClick={() => handleSortChange('Date Added (Newest)')}>
                        Date Added (Newest)
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                {/* Add Book Button */}
                <Button 
                  variant="success" 
                  onClick={() => setShowAddBookForm(!showAddBookForm)}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Add Book
                </Button>
              </Card.Body>
            </Card>

            {/* Add Book Form (Conditional) */}
            {showAddBookForm && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Add a New Book</h5>
                    <Button 
                      variant="link" 
                      className="text-danger p-0" 
                      onClick={() => setShowAddBookForm(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </div>
                  <Form onSubmit={handleAddBook}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., The Hobbit" 
                            value={newBook.title}
                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Author</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., J.R.R. Tolkien" 
                            value={newBook.author}
                            onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={newBook.category_id}
                            onChange={(e) => setNewBook({...newBook, category_id: e.target.value})}
                            required
                          >
                            <option value="">Select Category</option>
                            {categoriesData?.getCategories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Published Year</Form.Label>
                          <Form.Control 
                            type="number" 
                            value={newBook.published_year}
                            onChange={(e) => setNewBook({...newBook, published_year: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cover Image URL (Optional)</Form.Label>
                          <Form.Control 
                            type="url" 
                            placeholder="https://..." 
                            value={newBook.cover_url}
                            onChange={(e) => setNewBook({...newBook, cover_url: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                      <Button 
                        variant="light" 
                        onClick={() => setShowAddBookForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="success" type="submit">
                        Save Book
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Books Grid */}
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Your Books</h5>
                {booksData.getBooks.books.length === 0 ? (
                  <Alert variant="info">No books found. Add your first book!</Alert>
                ) : (
                  <Row xs={1} sm={2} lg={3} className="g-4">
                    {booksData.getBooks.books.map((book) => (
                      <Col key={book.id}>
                        <Card className="h-100 shadow-sm hover-shadow transition-all">
                          <Link to={`/books/${book.id}`} className="text-decoration-none">
                          <div style={{ height: '200px', overflow: 'hidden' }}>
                            <Image
                              src={book.cover_url || `https://placehold.co/300x400/6c757d/ffffff?text=${encodeURIComponent(book.title.substring(0, 15))}`}
                              alt={book.title}
                              className="w-100 h-100 object-cover"
                              fluid
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/300x400/e2e8f0/94a3b8?text=No+Image';
                              }}
                            />
                          </div>
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <Card.Title className="fs-6">{book.title}</Card.Title>
                              <Button 
                                variant="link" 
                                className="text-danger p-0"
                                onClick={() => {
                                  setBookToDelete(book.id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                            <Card.Text className="text-muted small mb-2">
                              By {book.author}
                            </Card.Text>
                            {book.category && (
                              <Badge pill bg={getCategoryBadgeColor(book.category)}>
                                {book.category.name}
                              </Badge>
                            )}
                          </Card.Body>
                          </Link>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Column */}
          <Col lg={4} className="mt-4 mt-lg-0">
            {/* Add Category Card */}
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Add New Category</h5>
                <Form onSubmit={handleAddCategory}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., Fantasy" 
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Add Category
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this book? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBook}>
              Delete Book
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default BookList;