import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LikeButtonProps {
  likes: number;
  onLike: () => void;
}

export default function LikeButton({ likes, onLike }: LikeButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Pop animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
    onLike();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name="heart-outline" size={20} color="#6C63FF" />
      </Animated.View>
      <Text style={styles.text}>{likes}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, alignSelf: 'flex-end' },
  text: { fontSize: 14, fontWeight: 'bold', color: '#6C63FF' }
});
