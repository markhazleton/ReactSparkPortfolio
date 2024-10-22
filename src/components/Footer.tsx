import React from 'react';
import { Text, View, Linking, StyleSheet, TouchableOpacity } from 'react-native';

// Using the injected build date constant
const buildDate = __BUILD_DATE__;

const Footer: React.FC = () => {
  return (
    <View style={styles.footerContainer}>
      {/* Left-aligned content */}
      <View style={styles.leftContent}>
        <Text>© 2024 Mark Hazleton. All rights reserved.</Text>
        <Text>Last Build: {buildDate}</Text>
      </View>

      {/* Right-aligned content */}
      <View style={styles.rightContent}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://github.com/markhazleton/ReactSparkPortfolio')}
        >
          <Text style={styles.githubLink}>
            Visit the GitHub Repository
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the footer component
const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  leftContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  githubLink: {
    fontSize: 16,
    color: '#0d6efd',
    textDecorationLine: 'underline',
  },
});

export default Footer;
