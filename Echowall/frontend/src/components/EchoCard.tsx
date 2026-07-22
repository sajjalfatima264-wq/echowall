import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sunset from './CardTemplates/Sunset';
import Midnight from './CardTemplates/Midnight';
import Campus from './CardTemplates/Campus';
import Minimal from './CardTemplates/Minimal';
import Dream from './CardTemplates/Dream';
import { getFontFamily } from './FontSelector';

const Map: Record<string, React.FC<any>> = { Sunset, Midnight, Campus, Minimal, Dream };

export default function EchoCard({ message, theme, font, imageUrl, voiceUrl, likes, onLike }: { message: string; theme: string; font?: string; imageUrl?: string | null; voiceUrl?: string | null; likes: number; onLike: () => void }) {
  const Template = Map[theme] || Minimal;
  const fontFamily = getFontFamily(font || 'Modern');

  const getFullUrl = (url: string) => {
    if (!url || url.startsWith('data:') || url.startsWith('http')) return url;
    const baseApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost192.168.12.90:8000/api';
    const baseUrl = baseApiUrl.split('/api')[0];
    return `${baseUrl}${url}`;
  };

  return (
    <View style={styles.wrapper}>
      <Template message={message} fontFamily={fontFamily} imageUrl={getFullUrl(imageUrl || '')} voiceUrl={voiceUrl} />
      <View style={styles.footer}>
        <Text style={styles.anon}>Anonymous</Text>
        <Pressable onPress={onLike} style={styles.likeBtn}>
          <Ionicons name="heart" size={12} color="#fff" />
          <Text style={styles.likes}>{likes}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  anon: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '500', fontFamily: 'Outfit_600SemiBold' },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  likes: { color: '#fff', fontSize: 11, fontWeight: '600', fontFamily: 'Outfit_600SemiBold' }
});