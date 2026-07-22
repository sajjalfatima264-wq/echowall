import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default React.memo(function Funny({ message, anonymous }: { message: string, anonymous: boolean }) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>🤡</Text>
      <Text style={styles.title}>ECHO</Text>
      <Text style={styles.message}>"{message}"</Text>
      <Text style={styles.author}>{anonymous ? 'Anonymous' : 'User'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFD700', borderRadius: 24, padding: 24, minHeight: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#000', transform: [{ rotate: '-1deg' }] },
  emoji: { fontSize: 32, marginBottom: 8 },
  title: { color: '#000', fontSize: 14, letterSpacing: 2, marginBottom: 12, fontWeight: 'bold' },
  message: { color: '#000', fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 16, lineHeight: 28 },
  author: { color: '#333', fontSize: 14, fontStyle: 'italic', fontWeight: 'bold' }
});
