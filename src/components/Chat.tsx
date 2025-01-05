import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, NativeSyntheticEvent, TextInputKeyPressEventData, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import ReactMarkdown from 'react-markdown';
import * as signalR from '@microsoft/signalr';
import { Button } from 'react-bootstrap';

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

  const streamingBuffer = useRef('');
  const conversationId = useRef<string>(new Date().getTime().toString());
  const connection = useRef<signalR.HubConnection | null>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstChunk = useRef(true);

  useEffect(() => {
    const setupSignalRConnection = async () => {
      try {
        connection.current = new signalR.HubConnectionBuilder()
          .withUrl('https://webspark.markhazleton.com/chatHub')
          .build();

        await connection.current.start();
        setIsConnecting(false);
        console.log('Connected to SignalR hub');

        connection.current.on('ReceiveMessage', handleReceiveMessage);
      } catch (error) {
        console.error('SignalR connection failed:', error);
        setIsConnecting(false);
      }
    };

    setupSignalRConnection();

    return () => {
      connection.current?.off('ReceiveMessage', handleReceiveMessage);
      connection.current?.stop();
      if (streamingTimeoutRef.current) clearTimeout(streamingTimeoutRef.current);
    };
  }, [variantName]);

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

  const addNewMessage = (content: string, user: string, isBot: boolean) => {
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
  };

  const updateLastMessage = (chunk: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        content: lastMessage.content + chunk,
      };
      return updatedMessages;
    });
  };

  const sanitizeInput = (input: string): string => {
    return input.replace(/<\/?[^>]+(>|$)/g, ''); // Strips HTML tags
  };

  const handleJoinChat = () => {
    if (userInput.trim()) {
      setUserName(userInput.trim());
      setUserInput('');
      if (initialMessage) {
        connection.current?.invoke('SendMessage', userInput, initialMessage, conversationId.current, variantName).catch(console.error);
      }
    }
  };

  const handleSendMessage = () => {
    if (userName && chatInput.trim()) {
      connection.current?.invoke('SendMessage', userName, chatInput.trim(), conversationId.current, variantName).catch(console.error);
      setChatInput('');
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      handleJoinChat();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.user === variantName ? styles.botMessage : styles.userMessage]}>
      <Text style={styles.user}>
        {item.user} ({item.timestamp}):
      </Text>
      <ReactMarkdown>{item.content}</ReactMarkdown>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {isConnecting ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : !userName ? (
        <View style={styles.joinContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userInput}
            onChangeText={setUserInput}
            onKeyPress={handleKeyPress}
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
            contentContainerStyle={{ paddingBottom: 80 }}
          />
          {isBotTyping && <Text style={styles.typingIndicator}>Bot is typing...</Text>}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
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
  typingIndicator: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Chat;
