import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound: React.FC = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-5">
            The page you're looking for doesn't exist or has been moved.
          </p>
          {/* Changed from Button as={Link} to a Link component with button styling */}
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;