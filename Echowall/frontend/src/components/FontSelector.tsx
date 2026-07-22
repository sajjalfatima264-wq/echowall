import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const FONTS = ['Modern', 'Simple', 'Cursive', 'Old English'];

export const getFontFamily = (font: string) => {
  switch (font) {
    case 'Modern': return 'Outfit_600SemiBold';
    case 'Simple': return 'DMSans_400Regular';
    case 'Cursive': return 'DancingScript_700Bold';
    case 'Old English': return 'Cinzel_700Bold';
    default: return 'Outfit_600SemiBold';
  }
};

export default function FontSelector({ selected, onSelect }: { selected: string; onSelect: (font: string) => void }) {
  return (
    <View style={styles.container}>
      {FONTS.map((font) => (
        <TouchableOpacity 
          key={font} 
          style={[styles.pill, selected === font && styles.selectedPill]} 
          onPress={() => onSelect(font)}
        >
          <Text style={[styles.text, selected === font && styles.selectedText, { fontFamily: getFontFamily(font) }]}>
            {font}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
  selectedPill: { backgroundColor: '#7B6EF6', borderColor: '#7B6EF6' },
  text: { color: '#8E8E93', fontSize: 12 },
  selectedText: { color: '#fff' }
});