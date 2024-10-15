import React from 'react';
import { Text, View } from 'react-native';

// Using the injected build date constant
const buildDate = __BUILD_DATE__;

const Footer: React.FC = () => {
  return (
    <View style={{ padding: 10 }}>
      <Text>© 2024 Mark Hazleton. All rights reserved.</Text>
      <Text>Last Build: {buildDate}</Text>
    </View>
  );
};

export default Footer;
