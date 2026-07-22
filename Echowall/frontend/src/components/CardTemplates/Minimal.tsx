import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AudioPlayer from '../AudioPlayer';
export default React.memo(function Minimal({ message, fontFamily, imageUrl, voiceUrl }: { message: string, fontFamily: string, imageUrl: string | null, voiceUrl: string | null }) {
  return (
    <LinearGradient colors={['#1C1C2E', '#2D2D44']} style={styles.card}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      {voiceUrl && <AudioPlayer uri={voiceUrl} />}
      {message ? <Text style={[styles.message, { fontFamily }]}>"{message}"</Text> : null}
    </LinearGradient>
  );
});
const styles = StyleSheet.create({ card: { borderRadius: 24, padding: 20, minHeight: 140 }, image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }, message: { color: '#F0F0FF', fontSize: 18 } });
