import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AudioPlayer from '../AudioPlayer';
export default React.memo(function Sunset({ message, fontFamily, imageUrl, voiceUrl }: { message: string, fontFamily: string, imageUrl: string | null, voiceUrl: string | null }) {
  return (
    <LinearGradient colors={['#FF6B6B', '#FFE66D', '#FF8E53']} style={styles.card}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      {voiceUrl && <AudioPlayer uri={voiceUrl} />}
      {message ? <Text style={[styles.message, { fontFamily }]}>"{message}"</Text> : null}
    </LinearGradient>
  );
});
const styles = StyleSheet.create({ card: { borderRadius: 24, padding: 20, minHeight: 140 }, image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }, message: { color: '#1A0A00', fontSize: 18 } });
