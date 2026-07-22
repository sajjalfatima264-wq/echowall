import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EchoCard from '@/components/EchoCard';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { getRevealedEchoes, toggleLike } from '@/services/echoService';
import { apiClient } from '@/services/api';

export default function GalleryScreen({ route, navigation }: RootStackScreenProps<'Gallery'>) {
  const insets = useSafeAreaInsets();
  const { communityId } = route.params;
  const [echoes, setEchoes] = useState<any[]>([]);
  const [communityName, setCommunityName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const community = await apiClient.get(`/communities/${communityId}`);
      setCommunityName(community.name);
      const data = await getRevealedEchoes(communityId);
      setEchoes(data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLike = async (id: number) => {
    setEchoes(prev => prev.map(e => e.id === id ? { ...e, likes_count: e.likes_count + 1 } : e));
    try { await toggleLike(id); } catch (e) { fetchData(); }
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#7B6EF6" /></View>;

  return (
    <View style={styles.container}>
      <View style={[styles.navHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Revealed Echoes</Text>
        <View style={styles.navBtn}>
          <Ionicons name="sparkles" size={20} color="#fff" />
        </View>
      </View>

      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>{communityName}</Text>
          <Text style={styles.bannerSub}>Shared together, revealed together.</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Revealed</Text>
        </View>
      </View>

      <FlatList
        data={echoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
        renderItem={({ item }) => (
          <EchoCard 
            message={item.content} 
            theme={item.theme} 
            font={item.card_style} 
            imageUrl={item.image_url} 
            voiceUrl={item.voice_url} 
            likes={item.likes_count} 
            onLike={() => handleLike(item.id)} 
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="sparkles" size={48} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyTitle}>Nothing has revealed yet.</Text>
            <Text style={styles.emptySub}>When the timer ends, every Echo will appear here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  navBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  navTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  banner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bannerSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 },
  pill: { backgroundColor: 'rgba(79,209,197,0.1)', borderWidth: 1, borderColor: 'rgba(79,209,197,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillText: { color: '#4FD1C5', fontSize: 11, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  emptySub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8, textAlign: 'center' }
});