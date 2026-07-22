import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function AudioPlayer({ uri }: { uri: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost192.168.12.90:8000/api';
  const baseUrl = API_URL.split('/api')[0];
  const fullUri = uri.startsWith('http') || uri.startsWith('file://') ? uri : `${baseUrl}${uri}`;

  useEffect(() => {
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: fullUri });
        setSound(newSound);
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    loadSound();
    return () => { if (sound) sound.unloadAsync(); };
  }, []);

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.replayAsync();
      setIsPlaying(true);
      Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
      ])).start();
    }
  };

  if (loading) return <ActivityIndicator size="small" color="#fff" style={{ marginVertical: 20 }} />;

  return (
    <TouchableOpacity style={styles.container} onPress={togglePlayback}>
      <Animated.View style={{ transform: [{ scale: isPlaying ? pulseAnim : 1 }] }}>
        <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={32} color="#fff" />
      </Animated.View>
      <Text style={styles.text}>{isPlaying ? "Playing..." : "Play Voice Note"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  text: { color: '#fff', fontSize: 14, fontFamily: 'DMSans_400Regular' }
});