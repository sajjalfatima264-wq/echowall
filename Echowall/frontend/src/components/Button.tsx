import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, variant === 'secondary' && styles.secondary]} 
      onPress={onPress} 
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 12, alignItems: 'center', width: '100%' },
  secondary: { backgroundColor: '#E0E0E0' },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
