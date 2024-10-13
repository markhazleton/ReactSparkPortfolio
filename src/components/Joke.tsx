import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native-web';

type Joke = {
  error: boolean;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  category: string;
};

const Joke = () => {
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 20 }}>Failed to fetch the joke. Please try again.</Text>
        <Button title="Retry" onPress={fetchJoke} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {joke ? (
        joke.type === 'single' ? (
          <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>{joke.joke}</Text>
        ) : (
          <>
            <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 10 }}>{joke.setup}</Text>
            <hr style={{ width: '100%', margin: '10px 0' }} />
            <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>{joke.delivery}</Text>
          </>
        )
      ) : (
        <Text>No joke available.</Text>
      )}
      <Button title="Get Another Joke" onPress={fetchJoke} />
    </View>
  );
};

export default Joke;
