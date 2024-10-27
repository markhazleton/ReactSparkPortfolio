import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import ReactMarkdown from 'react-markdown';
import * as signalR from '@microsoft/signalr';
import { Button } from 'react-bootstrap';

interface Message {
  id: string;
  user: string;
  content: string;
}

interface ChatProps {
  variantName: string;
  initialMessage?: string; // Initial joke message
}

const Chat: React.FC<ChatProps> = ({ variantName, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const streamingBuffer = useRef(''); // Accumulated bot response chunks
  const conversationId = useRef<string>(new Date().getTime().toString());
  const connection = useRef<signalR.HubConnection | null>(null);
  const initialMessageSent = useRef(false); // Flag to check if the initial message is already sent
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout for message completion detection
  const isFirstChunk = useRef(true); // Track if this is the first chunk of the bot response

  useEffect(() => {
    // Set up connection to SignalR
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl('https://webspark.markhazleton.com/chatHub')
      .build();

    connection.current.start()
      .then(() => {
        console.log('Connected to SignalR hub');
      })
      .catch(error => console.error('Connection failed: ', error));

    // Handle receiving new messages from the server
    connection.current.on('ReceiveMessage', (user: string, messageChunk: string) => {
      console.log(`Received chunk from ${user}:`, messageChunk); // Log each chunk received

      if (user === variantName) {
        // Append each chunk to the streaming buffer
        streamingBuffer.current += messageChunk;

        // Clear and reset the timer for handling message completion
        if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);

        // If it's the first chunk, add it as a new message
        if (isFirstChunk.current) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: `${Date.now()}`, user, content: messageChunk }
          ]);
          isFirstChunk.current = false;
        } else {
          // Update the last message with the new chunk for streaming effect
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + messageChunk
            };
            return updatedMessages;
          });
        }

        // Start a timeout to finalize the message after the last chunk
        streamingTimeoutRef.current = setTimeout(() => {
          isFirstChunk.current = true; // Reset for the next bot response
          streamingBuffer.current = ''; // Clear buffer
          streamingTimeoutRef.current = null;
        }, 1000); // Adjust this delay as needed to detect end of message
      } else {
        // Non-streaming message (e.g., from user) – add directly
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: `${Date.now()}`, user, content: messageChunk }
        ]);
      }
    });

    return () => {
      connection.current?.stop();
      if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current); // Clean up timeout on unmount
    };
  }, [variantName]);

  const handleJoinChat = () => {
    if (userInput.trim()) {
      setUserName(userInput);
      setUserInput('');

      // Send the initial joke message once the user has joined
      if (initialMessage && !initialMessageSent.current) {
        initialMessageSent.current = true; // Mark as sent
        connection.current?.invoke('SendMessage', userInput, initialMessage, conversationId.current, variantName)
          .catch(error => console.error('SendMessage failed: ', error));
      }
    }
  };

  const handleSendMessage = () => {
    if (userName && chatInput) {
      // Only send the message to SignalR; do not add directly to `messages`
      connection.current?.invoke('SendMessage', userName, chatInput, conversationId.current, variantName)
        .catch(error => console.error('SendMessage failed: ', error));
      setChatInput(''); // Clear the input field
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      handleJoinChat();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.user === variantName ? styles.botMessage : styles.userMessage]}>
      <Text style={styles.user}>{item.user}:</Text>
      <ReactMarkdown>{item.content}</ReactMarkdown>
    </View>
  );

  return (
    <View style={styles.container}>
      {!userName ? (
        <View style={styles.joinContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userInput}
            onChangeText={(text) => setUserInput(text)}
            onKeyPress={handleKeyPress} // Handle Enter key press
          />
          <Button variant="primary" onClick={handleJoinChat}>
            Join Chat
          </Button>
        </View>
      ) : (
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={chatInput}
              onChangeText={(text) => setChatInput(text)}
              onSubmitEditing={handleSendMessage}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    height: '90vh', // 90% of the viewport height
    overflow: 'scroll', // Enables scrolling within the chat container
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  messageContainer: {
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
  userMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
  },
  botMessage: {
    backgroundColor: '#d3d3d3',
    alignSelf: 'flex-end',
  },
  user: {
    fontWeight: 'bold',
  },
});

export default Chat;
