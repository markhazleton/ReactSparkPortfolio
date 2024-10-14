import React, { useEffect, useState } from 'react';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import { EmojiLaughing, ArrowRepeat } from 'react-bootstrap-icons'; // Bootstrap Icons

type Joke = {
  error: boolean;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  category: string;
};

const Joke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchJoke = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
      const data: Joke = await response.json();
      setJoke(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="danger" className="text-center">
          Failed to fetch the joke. Please try again.
        </Alert>
        <Button variant="primary" onClick={fetchJoke}>
          <ArrowRepeat className="me-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Jumbotron-like section for the joke */}
      <div className="bg-light p-5 rounded mb-4 text-center">
        <EmojiLaughing size={40} className="mb-3 text-primary" />
        {joke ? (
          joke.type === 'single' ? (
            <h2 className="mb-3">{joke.joke}</h2>
          ) : (
            <>
              <h2 className="mb-3">{joke.setup}</h2>
              <hr />
              <h3 className="fw-bold">{joke.delivery}</h3>
            </>
          )
        ) : (
          <h2>No joke available.</h2>
        )}
      </div>

      {/* Button to fetch another joke */}
      <div className="text-center">
        <Button variant="success" onClick={fetchJoke}>
          <ArrowRepeat className="me-2" /> Get Another Joke
        </Button>
      </div>
    </div>
  );
};

export default Joke;
