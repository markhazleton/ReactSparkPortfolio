import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import * as signalR from '@microsoft/signalr';
import { Button, Form, Card, Container, Spinner, Alert } from 'react-bootstrap';
import './Chat.css';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  variantName: string;
  initialMessage?: string; // Initial message to send
  isInModal?: boolean; // Flag to indicate if chat is in a modal
}

const Chat: React.FC<ChatProps> = ({ variantName, initialMessage = '', isInModal = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  // Initialize userName from localStorage
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('chatUserName') || '';
  });
  const [userInput, setUserInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const streamingBuffer = useRef('');
  const conversationId = useRef<string>(new Date().getTime().toString());
  const connection = useRef<signalR.HubConnection | null>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstChunk = useRef(true);

  const sanitizeInput = React.useCallback((input: string): string => {
    return input.replace(/<\/?[^>]+(>|$)/g, ''); // Strips HTML tags
  }, []);

  const addNewMessage = React.useCallback((content: string, user: string, isBot: boolean) => {
    const sanitizedContent = sanitizeInput(content);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: `${Date.now()}`,
        user,
        content: sanitizedContent,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    if (!isBot) setIsBotTyping(false);
  }, [sanitizeInput]);

  const updateLastMessage = React.useCallback((chunk: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        content: lastMessage.content + chunk,
      };
      return updatedMessages;
    });
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (user: string, messageChunk: string) => {
      if (user === variantName) {
        setIsBotTyping(true);
        streamingBuffer.current += sanitizeInput(messageChunk);

        if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);

        if (isFirstChunk.current) {
          addNewMessage(messageChunk, user, true);
          isFirstChunk.current = false;
        } else {
          updateLastMessage(messageChunk);
        }

        streamingTimeoutRef.current = setTimeout(() => {
          isFirstChunk.current = true;
          streamingBuffer.current = '';
          setIsBotTyping(false);
        }, 1000);
      } else {
        addNewMessage(messageChunk, user, false);
      }
    };

    const setupSignalRConnection = async (retryCount: number = 0) => {
      try {
        setConnectionError(null);
        setIsRetrying(retryCount > 0);
        
        connection.current = new signalR.HubConnectionBuilder()
          .withUrl('https://webspark.markhazleton.com/chatHub', {
            skipNegotiation: false,
            withCredentials: false,
            timeout: 30000, // 30 second timeout
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
          })
          .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry at 0ms, 2s, 10s, 30s
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Handle connection events
        connection.current.onclose((error) => {
          console.log('SignalR connection closed:', error);
          if (error && retryCount < 3) {
            console.log(`Retrying connection (attempt ${retryCount + 1})...`);
            setTimeout(() => setupSignalRConnection(retryCount + 1), Math.pow(2, retryCount) * 1000);
          }
        });

        connection.current.onreconnecting((error) => {
          console.log('SignalR reconnecting:', error);
          setIsConnecting(true);
        });

        connection.current.onreconnected(() => {
          console.log('SignalR reconnected');
          setIsConnecting(false);
          setConnectionError(null);
          setIsRetrying(false);
        });

        await connection.current.start();
        setIsConnecting(false);
        setIsRetrying(false);
        console.log('Connected to SignalR hub');

        connection.current.on('ReceiveMessage', handleReceiveMessage);
        
        // If we have a username and an initial message, send it automatically
        const savedUserName = localStorage.getItem('chatUserName');
        if (savedUserName && initialMessage) {
          setTimeout(() => {
            connection.current?.invoke('SendMessage', savedUserName, initialMessage, conversationId.current, variantName).catch(console.error);
          }, 500);
        }
      } catch (error) {
        console.error('SignalR connection failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Connection failed';
        setConnectionError(errorMessage);
        setIsConnecting(false);
        setIsRetrying(false);
        
        // For modal usage, provide a fallback experience
        if (isInModal) {
          console.log('Modal mode: Using fallback chat experience');
          setIsConnecting(false);
          setConnectionError(null);
          // Add a welcome message for offline mode
          addNewMessage('Welcome to the Joke Explainer! Connection to the AI chat service is currently unavailable, but you can still view the joke above.', variantName, true);
          return;
        }
        
        // Retry with exponential backoff
        if (retryCount < 3) {
          console.log(`Retrying connection in ${Math.pow(2, retryCount)} seconds...`);
          setTimeout(() => setupSignalRConnection(retryCount + 1), Math.pow(2, retryCount) * 1000);
        }
      }
    };

    setupSignalRConnection();

    return () => {
      connection.current?.off('ReceiveMessage', handleReceiveMessage);
      connection.current?.stop();
      if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);
    };
  }, [variantName, initialMessage, addNewMessage, sanitizeInput, updateLastMessage, isInModal]);

  const handleRetryConnection = () => {
    setIsConnecting(true);
    setConnectionError(null);
    setIsRetrying(false);
    
    // Create a new connection
    const retryConnection = async () => {
      try {
        connection.current = new signalR.HubConnectionBuilder()
          .withUrl('https://webspark.markhazleton.com/chatHub', {
            skipNegotiation: false,
            withCredentials: false,
            timeout: 30000,
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
          })
          .withAutomaticReconnect([0, 2000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Information)
          .build();

        await connection.current.start();
        setIsConnecting(false);
        console.log('Reconnected to SignalR hub');

        connection.current.on('ReceiveMessage', (user: string, messageChunk: string) => {
          if (user === variantName) {
            setIsBotTyping(true);
            streamingBuffer.current += sanitizeInput(messageChunk);

            if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);

            if (isFirstChunk.current) {
              addNewMessage(messageChunk, user, true);
              isFirstChunk.current = false;
            } else {
              updateLastMessage(messageChunk);
            }

            streamingTimeoutRef.current = setTimeout(() => {
              isFirstChunk.current = true;
              streamingBuffer.current = '';
              setIsBotTyping(false);
            }, 1000);
          } else {
            addNewMessage(messageChunk, user, false);
          }
        });
      } catch (error) {
        console.error('Manual retry failed:', error);
        setConnectionError(error instanceof Error ? error.message : 'Retry failed');
        setIsConnecting(false);
      }
    };

    retryConnection();
  };

  const handleJoinChat = () => {
    if (userInput.trim()) {
      const trimmedUserName = userInput.trim();
      setUserName(trimmedUserName);
      // Save username to localStorage for future sessions
      localStorage.setItem('chatUserName', trimmedUserName);
      setUserInput('');
      if (initialMessage) {
        connection.current?.invoke('SendMessage', trimmedUserName, initialMessage, conversationId.current, variantName).catch(console.error);
      }
    }
  };

  const handleSendMessage = () => {
    if (userName && chatInput.trim()) {
      connection.current?.invoke('SendMessage', userName, chatInput.trim(), conversationId.current, variantName).catch(console.error);
      setChatInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoinChat();
    }
  };

  const renderMessage = (message: Message) => (
    <Card key={message.id} className={`mb-2 ${message.user === variantName ? 'ms-auto bg-light' : 'me-auto bg-primary text-white'}`} style={{ maxWidth: '80%' }}>
      <Card.Body className="py-2 px-3">
        <small className="fw-bold">
          {message.user} ({message.timestamp}):
        </small>
        <div className="mt-1">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="d-flex flex-column h-100 p-0">
      {isConnecting ? (
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>{isRetrying ? 'Retrying connection to chat...' : 'Connecting to chat...'}</p>
          {connectionError && (
            <small className="text-muted mt-2">Previous error: {connectionError}</small>
          )}
        </div>
      ) : connectionError ? (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center p-3">
          <Alert variant="warning" className="mb-3">
            <Alert.Heading>Connection Issue</Alert.Heading>
            <p>{connectionError}</p>
            {isRetrying && (
              <div className="d-flex align-items-center justify-content-center mt-2">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Retrying connection...</span>
              </div>
            )}
          </Alert>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleRetryConnection} disabled={isConnecting || isRetrying}>
              {isConnecting || isRetrying ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isRetrying ? 'Retrying...' : 'Connecting...'}
                </>
              ) : (
                'Retry Connection'
              )}
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      ) : !userName ? (
          <div className="d-flex flex-column justify-content-center align-items-center h-100 p-3">
          <Form.Group className="mb-3 chat-name-input">
            <Form.Label>Enter your name to join the chat</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleJoinChat}>
            Join Chat
          </Button>
        </div>
      ) : (
        <div className="d-flex flex-column h-100">
          <div className={`flex-grow-1 overflow-auto p-3 ${isInModal ? 'chat-messages-container-modal' : 'chat-messages-container'}`}>
            {messages.map(renderMessage)}
            {isBotTyping && (
              <div className="text-center my-3">
                <em className="text-muted">Bot is typing...</em>
              </div>
            )}
          </div>
          <div className="border-top p-3">
            <Form.Group>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="primary" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </Form.Group>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Chat;
