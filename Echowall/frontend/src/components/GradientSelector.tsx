import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COMMUNITY_GRADIENTS } from '@/utils/gradients';

export default function GradientSelector({ selected, onSelect }: { selected: string; onSelect: (g: string) => void }) {
  const keys = Object.keys(COMMUNITY_GRADIENTS);

  return (
    <View style={styles.container}>
      {keys.map((key) => {
        // Cast directly to the exact tuple type expo-linear-gradient expects
        const colors = COMMUNITY_GRADIENTS[key] as [string, string];
        return (
          <TouchableOpacity 
            key={key} 
            style={[styles.pill, selected === key && styles.selectedPill]} 
            onPress={() => onSelect(key)}
          >
            <LinearGradient colors={colors} style={styles.swatch} />
            <Text style={[styles.text, selected === key && styles.selectedText]}>{key}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
  selectedPill: { backgroundColor: 'rgba(123,110,246,0.2)', borderColor: '#7B6EF6' },
  swatch: { width: 14, height: 14, borderRadius: 7 },
  text: { color: '#8E8E93', fontSize: 12, fontWeight: '600' },
  selectedText: { color: '#fff' }
});