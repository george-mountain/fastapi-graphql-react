
import React from 'react';
import { 
  Container,
  Navbar,
  Nav,
  Row,
  Col
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Layout = ({ children, background = true }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="d-flex flex-column min-vh-100" style={background ? {
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
      fontFamily: "'Inter', sans-serif"
    } : { fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="shadow-sm" style={{ backdropFilter: 'blur(10px)' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            BookHaven
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/about" className="text-secondary">About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-secondary">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-top">
        <Container>
          <Row>
            <Col className="text-center text-muted">
              &copy; {currentYear} BookHaven. All rights reserved.
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;