
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, 
  faSignInAlt,
  faUserPlus,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <Container className="text-center py-5">
        <div className="mb-5">
          <FontAwesomeIcon 
            icon={faBookOpen} 
            className="text-primary" 
            style={{ fontSize: '5rem' }} 
          />
        </div>
        
        <h1 className="display-3 fw-bold mb-4">
          Welcome to <span className="text-primary">BookHaven</span>
        </h1>
        
        <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>
          Your personal space to manage, discover, and cherish your book collection.
        </p>
        
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Button 
            as={Link} 
            to="/login" 
            variant="primary" 
            size="lg" 
            className="px-4 py-3 shadow-sm"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
            Login
          </Button>
          
          <Button 
            as={Link} 
            to="/register" 
            variant="outline-primary" 
            size="lg" 
            className="px-4 py-3 shadow-sm"
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Register
          </Button>
          
          <Button 
            as={Link} 
            to="/books" 
            variant="light" 
            size="lg" 
            className="px-4 py-3 shadow-sm"
          >
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Browse Books
          </Button>
        </div>
      </Container>
    </Layout>
  );
};

export default Home;