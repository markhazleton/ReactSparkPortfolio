import React, { useEffect, useState } from 'react';
import { Button, Spinner, Alert, Modal, Card } from 'react-bootstrap';
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
        {error ? (
          <Alert variant="danger">Failed to fetch a joke. Please try again later.</Alert>
        ) : loading ? (
          <Spinner animation="border" role="status" className="mb-3" />
        ) : joke ? (
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

      <div className="text-center mb-4">
        <Button variant="success" onClick={fetchJoke} disabled={loading}>
          <ArrowRepeat className="me-2" /> Get Another Joke
        </Button>
        <Button variant="secondary" onClick={handleJokeExplainer} className="ms-3">
          Joke Explainer
        </Button>
      </div>

      {/* Bootstrap Card with YouTube Embed */}
      <Card className="mb-5">
        <Card.Header className="bg-primary text-white">Joke Explainer Video</Card.Header>
        <Card.Body className="text-center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/R9UPM9fHW-Y?si=njUwkztHdfm_8nBR"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Card.Body>
        <Card.Footer className="text-muted">
          Enjoy the video and don't forget to subscribe to the channel!  This is a video to explain the Joke Explainer functionality. 
        </Card.Footer>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Joke Explainer</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh', overflow: 'hidden' }}>
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Chat
              variantName="Joke Explainer"
              initialMessage={
                joke
                  ? joke.type === 'single'
                    ? joke.joke
                    : `${joke.setup} ${joke.delivery}`
                  : 'No joke available to explain.'
              }
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Joke;
