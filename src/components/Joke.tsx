import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Spinner, 
  Alert, 
  Modal, 
  Card,
  Badge,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { 
  EmojiLaughing, 
  ArrowRepeat, 
  QuestionCircle, 
  ExclamationTriangle,
  XCircle,
  Share,
  Heart,
  HeartFill,
  Clipboard,
  CheckCircle
} from 'react-bootstrap-icons';
import Chat from './Chat';

type Joke = {
  error: boolean;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  category: string;
  flags?: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
};

const Joke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [likedJokes, setLikedJokes] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<Joke[]>([]);

  // Initialize liked jokes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedJokes');
    if (savedLikes) {
      setLikedJokes(JSON.parse(savedLikes));
    }
    
    const savedHistory = localStorage.getItem('jokeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save liked jokes to localStorage
  const updateLikedJokes = (jokeId: number) => {
    let updatedLikes: number[];
    
    if (likedJokes.includes(jokeId)) {
      updatedLikes = likedJokes.filter(id => id !== jokeId);
    } else {
      updatedLikes = [...likedJokes, jokeId];
    }
    
    setLikedJokes(updatedLikes);
    localStorage.setItem('likedJokes', JSON.stringify(updatedLikes));
  };

  // Update joke history
  const updateHistory = (newJoke: Joke) => {
    // Keep only the last 10 jokes
    const updatedHistory = [newJoke, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    localStorage.setItem('jokeHistory', JSON.stringify(updatedHistory));
  };

  const fetchJoke = async () => {
    setLoading(true);
    setError(false);
    setCopied(false);
    
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Joke = await response.json();
      
      if (data.error) {
        throw new Error('API returned an error');
      }
      
      setJoke(data);
      updateHistory(data);
    } catch (e) {
      console.error('Error fetching joke:', e);
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

  const copyToClipboard = () => {
    if (!joke) return;
    
    const textToCopy = joke.type === 'single' 
      ? joke.joke 
      : `${joke.setup} ${joke.delivery}`;
      
    navigator.clipboard.writeText(textToCopy || '');
    setCopied(true);
    
    // Reset copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  const shareJoke = () => {
    if (!joke) return;
    
    const textToShare = joke.type === 'single' 
      ? joke.joke 
      : `${joke.setup} ${joke.delivery}`;
      
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Check out this joke!',
        text: textToShare,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
    }
  };

  const isJokeLiked = joke && likedJokes.includes(joke.id);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <ToastContainer position="top-end" className="p-3">
            <Toast show={copied} onClose={() => setCopied(false)} delay={3000} autohide>
              <Toast.Header>
                <CheckCircle className="me-2 text-success" />
                <strong className="me-auto">Success</strong>
              </Toast.Header>
              <Toast.Body>Joke copied to clipboard!</Toast.Body>
            </Toast>
          </ToastContainer>
          
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <EmojiLaughing size={24} className="me-2" />
                <h2 className="h4 mb-0">Random Joke</h2>
              </div>
              {joke && (
                <Badge bg="light" text="dark">
                  {joke.category}
                </Badge>
              )}
            </Card.Header>
            
            <Card.Body className="text-center py-5">
              {error ? (
                <Alert variant="danger" className="d-flex align-items-center">
                  <ExclamationTriangle className="me-2 flex-shrink-0" />
                  <div>Failed to fetch a joke. Please try again later.</div>
                </Alert>
              ) : loading ? (
                <div className="py-5">
                  <Spinner animation="border" role="status" className="mb-3">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="text-muted">Fetching a joke for you...</p>
                </div>
              ) : joke ? (
                <div className="py-4">
                  {joke.type === 'single' ? (
                    <h3 className="mb-0 fw-normal">{joke.joke}</h3>
                  ) : (
                    <>
                      <h3 className="mb-4 fw-normal">{joke.setup}</h3>
                      <hr />
                      <h3 className="mt-4 fw-bold">{joke.delivery}</h3>
                    </>
                  )}
                </div>
              ) : (
                <h3>No joke available.</h3>
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white border-top-0">
              <div className="d-flex justify-content-between">
                <div>
                  <Button 
                    variant="primary" 
                    onClick={fetchJoke} 
                    disabled={loading}
                    className="me-2 d-flex align-items-center"
                  >
                    <ArrowRepeat className="me-2" /> New Joke
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleJokeExplainer}
                    className="d-flex align-items-center"
                  >
                    <QuestionCircle className="me-2" /> Explain Joke
                  </Button>
                </div>
                <div className="d-flex">
                  {joke && (
                    <>
                      <Button 
                        variant="outline-primary" 
                        className="me-2 d-flex align-items-center"
                        onClick={() => updateLikedJokes(joke.id)}
                      >
                        {isJokeLiked ? (
                          <><HeartFill className="me-2 text-danger" /> Liked</>
                        ) : (
                          <><Heart className="me-2" /> Like</>
                        )}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        className="me-2 d-flex align-items-center"
                        onClick={copyToClipboard}
                      >
                        <Clipboard className="me-2" /> Copy
                      </Button>
                      <Button 
                        variant="outline-success" 
                        className="d-flex align-items-center"
                        onClick={shareJoke}
                      >
                        <Share className="me-2" /> Share
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
          
          {/* Joke History */}
          {history.length > 1 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-light">
                <h3 className="h5 mb-0">Recently Viewed Jokes</h3>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  {history.slice(1, 5).map((historyJoke, index) => (
                    <div 
                      key={index} 
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div className="text-truncate max-width-70">
                        {historyJoke.type === 'single' 
                          ? historyJoke.joke 
                          : historyJoke.setup
                        }
                      </div>
                      <div>
                        <Badge bg="light" text="dark" className="me-2">
                          {historyJoke.category}
                        </Badge>
                        {likedJokes.includes(historyJoke.id) && (
                          <HeartFill className="text-danger" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
          
          {/* Joke Explainer Video */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h3 className="h5 mb-0">Learn About Joke Explainers</h3>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="ratio ratio-16x9 mb-3">
                <iframe
                  src="https://www.youtube.com/embed/R9UPM9fHW-Y?si=njUwkztHdfm_8nBR"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-muted small">
                This video explains the concept of joke explainers and how they help understand humor.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Joke Explainer Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <QuestionCircle className="me-2 text-primary" /> Joke Explainer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 modal-tall">
          <div className="h-100 overflow-auto">
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