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
          <Button as={Link} to="/" variant="primary">
            Return to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;