import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CountdownWidget({ time, size = 'lg' }: { time: string; size?: 'sm' | 'lg' }) {
  if (size === 'sm') {
    return (
      <View style={styles.smContainer}>
        <Ionicons name="lock-closed" size={11} color="#7B6EF6" />
        <Text style={styles.smText}>Reveal in {time}</Text>
      </View>
    );
  }

  const parts = time.split(':');
  const labels = ['hrs', 'min', 'sec'];

  return (
    <View style={styles.lgContainer}>
      {parts.map((part, i) => (
        <View key={i} style={styles.boxContainer}>
          <View style={styles.box}>
            <Text style={styles.boxText}>{part}</Text>
          </View>
          <Text style={styles.boxLabel}>{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  smContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  smText: { color: '#7B6EF6', fontSize: 12, fontWeight: '600' },
  lgContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  boxContainer: { alignItems: 'center' },
  box: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(123,110,246,0.2)', borderWidth: 1, borderColor: 'rgba(123,110,246,0.3)', justifyContent: 'center', alignItems: 'center' },
  boxText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  boxLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }
});