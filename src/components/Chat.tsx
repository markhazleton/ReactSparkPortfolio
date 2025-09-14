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
}

const Chat: React.FC<ChatProps> = ({ variantName, initialMessage = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const streamingBuffer = useRef('');
  const conversationId = useRef<string>(new Date().getTime().toString());
  const connection = useRef<signalR.HubConnection | null>(null);
  const streamingTimeoutRef = useRef<number | null>(null);
  const isFirstChunk = useRef(true);

  // Load username from localStorage on component mount
  useEffect(() => {
    const savedUserName = localStorage.getItem('chatUserName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

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

    const setupSignalRConnection = async () => {
      try {
        setConnectionError(null);
        connection.current = new signalR.HubConnectionBuilder()
          .withUrl('https://webspark.markhazleton.com/chatHub', {
            skipNegotiation: false,
            withCredentials: false
          })
          .build();

        await connection.current.start();
        setIsConnecting(false);
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
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnecting(false);
      }
    };

    setupSignalRConnection();

    return () => {
      connection.current?.off('ReceiveMessage', handleReceiveMessage);
      connection.current?.stop();
      if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);
    };
  }, [variantName, initialMessage, addNewMessage, sanitizeInput, updateLastMessage]);

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
          <p>Connecting to chat...</p>
        </div>
      ) : connectionError ? (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center p-3">
          <Alert variant="danger" className="mb-3">
            Connection failed: {connectionError}
          </Alert>
          <Button variant="danger" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
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
          <div className="flex-grow-1 overflow-auto p-3 chat-messages-container">
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
