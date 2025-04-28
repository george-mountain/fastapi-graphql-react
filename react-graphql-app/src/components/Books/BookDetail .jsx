import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOOK } from '../../graphql/queries';
import { WRITE_REVIEW } from '../../graphql/mutations';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faBookOpen,
  faStar as solidStar,
  faStarHalfAlt as halfStar,
  faStar as regularStar
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../Layout';

const BookDetail = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: parseInt(id) }
  });

  const [writeReview] = useMutation(WRITE_REVIEW, {
    onCompleted: () => {
      setSuccessMessage('Review submitted successfully!');
      setReviewContent('');
      // Refetch book data to show new review
    },
   
    onError: (error) => {
        if (error.message.includes('Authentication required')) {
          alert('You must be logged in to add a review.');
          window.location.href = '/login';
        } else {
          console.error('Error adding a review:', error);
        }
      },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    writeReview({
      variables: {
        review: {
          bookId: parseInt(id),
          content: reviewContent,
          rating: parseInt(rating)
        }
      }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} className="text-warning" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="text-secondary" />);
      }
    }

    return stars;
  };

  if (loading) return (
    <Layout>
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <Alert variant="danger" className="my-5">
        Error loading book: {error.message}
      </Alert>
    </Layout>
  );

  const book = data?.getBook;

  return (
    <Layout background={false}>
      <Container className="py-4">
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        <Card className="shadow-lg">
          <Card.Body className="p-4">
            <Row className="mb-5">
              <Col md={4} className="d-flex justify-content-center">
                <img
                  src={book.cover_url || `https://placehold.co/300x450/6c757d/ffffff?text=${encodeURIComponent(book.title.substring(0, 15))}`}
                  alt={book.title}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '450px' }}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/300x450/e2e8f0/94a3b8?text=No+Image';
                  }}
                />
              </Col>

              <Col md={8}>
                <h1 className="display-4 fw-bold">{book.title}</h1>
                <p className="lead">By <span className="fw-semibold">{book.author}</span></p>

                <div className="d-flex align-items-center gap-3 mb-3">
                  {book.category && (
                    <Badge pill bg="primary" className="fs-6">
                      {book.category.name}
                    </Badge>
                  )}
                  <span className="text-muted">Publication Year: {book.publishedYear}</span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="fw-semibold">Rating:</span>
                  <div className="star-rating">
                    {renderStars(book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length || 0)}
                  </div>
                  <span className="text-muted">
                    ({book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>

                <div className="mb-4">
                  <h2 className="h4 fw-semibold">Summary</h2>
                  <p className="text-muted">
                    {book.summary || "No summary available for this book."}
                  </p>
                </div>

                <div className="d-flex gap-3">
                  <Button variant="success" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faBookmark} className="me-2" />
                    Add to Wishlist
                  </Button>
                  <Button variant="outline-secondary" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                    Mark as Read
                  </Button>
                </div>
              </Col>
            </Row>

            <div className="border-top pt-4">
              <h2 className="h3 fw-semibold mb-4">Reviews</h2>

              <Card className="mb-4 bg-light">
                <Card.Body>
                  <h3 className="h5 fw-medium mb-3">Leave a Review</h3>
                  <Form onSubmit={handleSubmitReview}>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Rating</Form.Label>
                      <Form.Select 
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-auto"
                      >
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Good</option>
                        <option value="2">2 Stars - Fair</option>
                        <option value="1">1 Star - Poor</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Your Review</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        required
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button variant="primary" type="submit">
                        Submit Review
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <div className="space-y-4">
                {book.reviews.length === 0 ? (
                  <p className="text-muted">No reviews yet. Be the first to review!</p>
                ) : (
                  book.reviews.map((review) => (
                    <div key={review.id} className="border-bottom pb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="fw-semibold me-3">{review.username}</span>
                        <div className="star-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-muted">{review.content}</p>
                      <small className="text-muted">
                        Reviewed on {new Date().toLocaleDateString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default BookDetail;