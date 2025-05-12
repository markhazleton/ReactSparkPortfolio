import React, { useEffect, useState, useCallback } from 'react';
import { 
  Button, 
  Spinner, 
  Alert, 
  Modal, 
  Card,
  Badge,
  Toast,
  ToastContainer,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import { 
  EmojiLaughing, 
  ArrowRepeat, 
  QuestionCircle, 
  ExclamationTriangle,
  Share,
  Heart,
  HeartFill,
  Clipboard,
  CheckCircle,
  BookmarkPlus,
  BookmarkFill,
  CodeSquare,
  Trash
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
  const [savedJokes, setSavedJokes] = useState<Joke[]>([]);
  const [jokeToExplain, setJokeToExplain] = useState<Joke | undefined>(undefined);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  // Initialize liked jokes and saved jokes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedJokes');
    if (savedLikes) {
      setLikedJokes(JSON.parse(savedLikes));
    }
    
    const savedHistory = localStorage.getItem('jokeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    const userSavedJokes = localStorage.getItem('userSavedJokes');
    if (userSavedJokes) {
      setSavedJokes(JSON.parse(userSavedJokes));
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

  // Save joke to user preferences
  const saveJoke = (jokeToSave: Joke) => {
    // Check if joke is already saved
    if (!savedJokes.some(savedJoke => savedJoke.id === jokeToSave.id)) {
      const updatedSavedJokes = [...savedJokes, jokeToSave];
      setSavedJokes(updatedSavedJokes);
      localStorage.setItem('userSavedJokes', JSON.stringify(updatedSavedJokes));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  // Remove joke from saved jokes
  const removeSavedJoke = (jokeId: number) => {
    const updatedSavedJokes = savedJokes.filter(joke => joke.id !== jokeId);
    setSavedJokes(updatedSavedJokes);
    localStorage.setItem('userSavedJokes', JSON.stringify(updatedSavedJokes));
  };

  // Wrap fetchJoke in useCallback with NO dependencies to keep it stable
  const fetchJoke = useCallback(async () => {
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
  }, []); // <--- empty array, not [updateHistory]

  useEffect(() => {
    fetchJoke();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJokeExplainer = (jokeToExplain: Joke | undefined = undefined) => {
    if (jokeToExplain) {
      setJokeToExplain(jokeToExplain);
    } else {
      setJokeToExplain(joke || undefined);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setJokeToExplain(undefined);
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
    if (navigator.share !== undefined && navigator.share !== null) {
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

  const isJokeLiked = joke ? likedJokes.includes(joke.id) : false;
  const isJokeSaved = joke ? savedJokes.some(savedJoke => savedJoke.id === joke.id) : false;

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
            
            <Toast show={savedNotification} onClose={() => setSavedNotification(false)} delay={3000} autohide>
              <Toast.Header>
                <BookmarkFill className="me-2 text-success" />
                <strong className="me-auto">Success</strong>
              </Toast.Header>
              <Toast.Body>Joke saved to your collection!</Toast.Body>
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
              <div className="d-flex justify-content-between flex-wrap">
                <div className="mb-2 mb-md-0">
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
                    onClick={() => handleJokeExplainer()}
                    className="d-flex align-items-center d-inline-flex"
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
                        className="me-2 d-flex align-items-center"
                        onClick={shareJoke}
                      >
                        <Share className="me-2" /> Share
                      </Button>
                      <Button 
                        variant="outline-info" 
                        className="d-flex align-items-center"
                        onClick={() => saveJoke(joke)}
                        disabled={isJokeSaved}
                      >
                        {isJokeSaved ? (
                          <><BookmarkFill className="me-2" /> Saved</>
                        ) : (
                          <><BookmarkPlus className="me-2" /> Save</>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Footer>
          </Card>
          
          {/* Saved Jokes */}
          {savedJokes.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-info text-white">
                <h3 className="h5 mb-0 d-flex align-items-center">
                  <BookmarkFill className="me-2" /> Your Saved Jokes
                </h3>
              </Card.Header>
              <ListGroup variant="flush">
                {savedJokes.map((savedJoke, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-start py-3">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold mb-1">{savedJoke.category}</div>
                      <div className="text-truncate joke-text-truncate">
                        {savedJoke.type === 'single' 
                          ? savedJoke.joke 
                          : savedJoke.setup
                        }
                      </div>
                    </div>
                    <div className="ms-2 d-flex">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleJokeExplainer(savedJoke)}
                      >
                        <QuestionCircle />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeSavedJoke(savedJoke.id)}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
          
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
          <Card className="shadow-sm mb-4">
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
          
          {/* How This Component Works */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h3 className="h5 mb-0 d-flex align-items-center">
                <CodeSquare className="me-2" /> How This Joke Component Works
              </h3>
            </Card.Header>
            <Card.Body>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Component Overview</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The Joke component provides an interactive interface for fetching and displaying random jokes from the JokeAPI. 
                      It's built with React and TypeScript, using React Bootstrap for UI components and React Bootstrap Icons for visual elements.
                    </p>
                    <p>
                      The component demonstrates several modern React patterns including:
                    </p>
                    <ul>
                      <li>State management with React hooks (useState, useEffect)</li>
                      <li>Asynchronous data fetching with error handling</li>
                      <li>Local storage for persistent data across sessions</li>
                      <li>Conditional rendering based on component state</li>
                      <li>User preference storage and retrieval</li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Data Flow</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      This component manages several pieces of state:
                    </p>
                    <ul>
                      <li><strong>joke</strong>: The current joke displayed to the user, fetched from JokeAPI</li>
                      <li><strong>likedJokes</strong>: Array of joke IDs that the user has liked, stored in localStorage</li>
                      <li><strong>history</strong>: Array of recently viewed jokes, stored in localStorage</li>
                      <li><strong>savedJokes</strong>: Array of complete joke objects that the user has saved to their collection</li>
                      <li><strong>loading</strong>: Boolean flag indicating if a joke is being fetched</li>
                      <li><strong>error</strong>: Boolean flag for error handling</li>
                    </ul>
                    <p>
                      When you interact with the component (like or save a joke), the data is immediately updated in both React state 
                      and localStorage, ensuring your preferences persist across browser sessions.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>API Integration</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The component connects to <a href="https://v2.jokeapi.dev/" target="_blank" rel="noopener noreferrer">JokeAPI</a> 
                      to fetch random jokes. Key features of this integration include:
                    </p>
                    <ul>
                      <li>Safe-mode parameter to filter out inappropriate content</li>
                      <li>Error handling for API failures</li>
                      <li>Support for both single and two-part joke formats</li>
                      <li>Loading states to improve user experience</li>
                    </ul>
                    <p>
                      The API response is typed using TypeScript interfaces, ensuring type safety throughout the component.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Joke Explainer Integration</Accordion.Header>
                  <Accordion.Body>
                    <p>
                      The Joke Explainer feature connects this component with the Chat component, creating an interactive 
                      experience for understanding humor:
                    </p>
                    <ul>
                      <li>When you click "Explain Joke", the current joke is passed to the Chat component as an initial message</li>
                      <li>You can also ask for explanations of jokes saved in your collection</li>
                      <li>The modal interface keeps the conversation focused while maintaining context</li>
                    </ul>
                    <p>
                      This integration demonstrates component composition and communication in React, passing data from 
                      the Joke component to the Chat component through props.
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                jokeToExplain
                  ? jokeToExplain.type === 'single'
                    ? jokeToExplain.joke
                    : `${jokeToExplain.setup} ${jokeToExplain.delivery}`
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