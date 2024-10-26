import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
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
}

const Chat: React.FC<ChatProps> = ({ variantName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const conversationId = useRef<string>(new Date().getTime().toString());
  const connection = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl('https://webspark.markhazleton.com/chatHub')
      .build();

    connection.current.start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(error => console.error('Connection failed: ', error));

    connection.current.on('ReceiveMessage', (user: string, messageChunk: string) => {
      if (user === variantName) {
        setStreamingMessage(prev => prev + messageChunk);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: `${Date.now()}`, user, content: messageChunk }
        ]);
      }
    });

    return () => {
      connection.current?.stop();
    };
  }, [variantName]);

  const handleSendMessage = () => {
    if (userName && chatInput) {
      if (streamingMessage) {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: `${Date.now()}`, user: variantName, content: streamingMessage }
        ]);
        setStreamingMessage('');
      }

      connection.current?.invoke('SendMessage', userName, chatInput, conversationId.current, variantName)
        .catch(error => console.error('SendMessage failed: ', error));
      setChatInput('');
    }
  };

  const handleJoinChat = () => {
    setUserName(userInput);
    setUserInput('');
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
            ListFooterComponent={
              streamingMessage ? (
                <View style={[styles.messageContainer, styles.botMessage]}>
                  <Text style={styles.user}>{variantName}:</Text>
                  <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                </View>
              ) : null
            }
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
