import React, { useRef } from 'react';
import { StyleSheet, Pressable, Text, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientButton({ title, onPress, loading, variant = 'primary' }: { title: string; onPress: () => void; loading?: boolean; variant?: 'primary' | 'secondary' }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={loading}>
        {variant === 'secondary' ? (
          <Animated.View style={styles.secondary}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
          </Animated.View>
        ) : (
          <LinearGradient colors={['#7B6EF6', '#483DFF']} style={styles.primary}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  primary: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#7B6EF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  secondary: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});