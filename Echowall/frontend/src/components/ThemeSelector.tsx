import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const THEMES = ['Sunset', 'Midnight', 'Campus', 'Minimal', 'Dream'];

interface ThemeSelectorProps {
  selected: string;
  onSelect: (theme: string) => void;
}

export default function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  return (
    <View style={styles.container}>
      {THEMES.map((theme) => (
        <TouchableOpacity 
          key={theme} 
          style={[styles.pill, selected === theme && styles.selectedPill]} 
          onPress={() => onSelect(theme)}
        >
          <Text style={[styles.text, selected === theme && styles.selectedText]}>{theme}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
  selectedPill: { backgroundColor: '#7B6EF6', borderColor: '#7B6EF6' },
  text: { color: '#8E8E93', fontSize: 12, fontWeight: '600' },
  selectedText: { color: '#fff', fontWeight: 'bold' }
});
