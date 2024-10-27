import React, { useEffect, useState } from 'react';
import { Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { EmojiLaughing, ArrowRepeat } from 'react-bootstrap-icons';
import Chat from './Chat';

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
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const handleJokeExplainer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
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

      <div className="text-center">
        <Button variant="success" onClick={fetchJoke}>
          <ArrowRepeat className="me-2" /> Get Another Joke
        </Button>
        <Button variant="secondary" onClick={handleJokeExplainer} className="ms-3">
          Joke Explainer
        </Button>
      </div>

      {/* Modal for Chat */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Joke Explainer</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh', overflow: 'hidden' }}>
          {/* Fixed height for Chat component */}
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Chat variantName="Joke Explainer" initialMessage={joke?.type === 'single' ? joke.joke : `${joke?.setup} ${joke?.delivery}`} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Joke;
