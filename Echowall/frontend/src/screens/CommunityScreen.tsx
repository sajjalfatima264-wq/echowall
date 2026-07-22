import React, { useState, useEffect } from 'react';
import { getGradient } from '@/utils/gradients';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Alert, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';
import CountdownTimer from '@/components/CountdownTimer';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';

export default function CommunityScreen({ route, navigation }: RootStackScreenProps<'Community'>) {
  const insets = useSafeAreaInsets();
  const { communityId } = route.params;
  const [statusData, setStatusData] = useState<any>(null);
  const [communityData, setCommunityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const status = await apiClient.get(`/echo/status/${communityId}`);
      setStatusData(status);
      const community = await apiClient.get(`/communities/${communityId}`);
      setCommunityData(community);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onShare = async () => {
    if (!communityData) return;
    const message = `Join my EchoWall community "${communityData.name}"! Use the invite code: ${communityData.invite_code}`;
    
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(message);
        alert("Copied to clipboard!");
      } catch (e) {
        alert("Copy failed. Here is the code: " + communityData.invite_code);
      }
    } else {
      try {
        await Share.share({ message });
      } catch (error: any) {
        Alert.alert("Error", "Could not share invite code.");
      }
    }
  };

  // Updated Loading State
  if (loading || !statusData || !communityData) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color="#7B6EF6" /></View>;
  }

  const isLocked = statusData.status === 'locked';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <LinearGradient colors={['rgba(123,110,246,0.2)', 'transparent']} style={styles.headerGradient} />
      
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{communityData.name}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CommunitySettings', { communityId })} style={styles.navBtn}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        {/* USE DYNAMIC COLORS HERE */}
        <LinearGradient colors={getGradient(communityData.gradient)} style={styles.heroIcon}>
          <Text style={styles.heroIconText}>{communityData.name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <Text style={styles.heroTitle}>{communityData.name}</Text>
        <View style={styles.memberRow}>
          <Ionicons name="people" size={12} color="rgba(255,255,255,0.4)" />
          <Text style={styles.memberText}>Members</Text>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>

      <GlassCard style={styles.card}>
        {isLocked ? (
          <>
            <Text style={styles.cardLabel}>Next shared reveal</Text>
            <CountdownTimer targetTime={statusData.remaining_time} onDone={fetchData} />
            <View style={styles.cyanIndicator} />
            <Text style={styles.cardSubtext}>Every Echo reveals together when the timer ends.</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardLabel}>Today's Reveal</Text>
            <Text style={styles.revealedText}>✨ Revealed!</Text>
            <Text style={styles.cardSubtext}>Echoes are now visible to everyone in the gallery.</Text>
          </>
        )}
      </GlassCard>

      <TouchableOpacity onPress={onShare} activeOpacity={0.8}>
        <GlassCard style={styles.inviteCard}>
          <View style={styles.inviteLeft}>
            <Ionicons name="people-circle-outline" size={24} color="#7B6EF6" />
            <View>
              <Text style={styles.inviteTitle}>Invite Friends</Text>
              <Text style={styles.inviteCode}>Code: {communityData.invite_code}</Text>
            </View>
          </View>
          <Ionicons name="share-outline" size={20} color="#7B6EF6" />
        </GlassCard>
      </TouchableOpacity>

      <GlassCard style={styles.panel}>
        <View style={styles.panelHeader}>
          <Ionicons name={isLocked ? "lock-closed" : "time-outline"} size={20} color={isLocked ? "#7B6EF6" : "#4FD1C5"} />
          <Text style={styles.panelTitle}>
            {isLocked ? "Your thought is waiting to be heard." : "The window for today's echoes has closed."}
          </Text>
        </View>
        <Text style={styles.panelSub}>
          {isLocked ? "Create an anonymous Echo Card." : "Come back tomorrow to share a new thought."}
        </Text>
        
        {isLocked && (
          <View style={{ marginTop: 16 }}>
            <GradientButton 
              title="Create an Echo" 
              onPress={() => navigation.navigate('CreateEcho', { communityId })} 
            />
          </View>
        )}
      </GlassCard>

      <GlassCard style={styles.panel}>
        <View style={styles.panelHeader}>
          <Ionicons name="eye" size={20} color="#4FD1C5" />
          <Text style={styles.panelTitle}>Discover what the community shared.</Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <GradientButton 
            title="View Gallery" 
            onPress={() => navigation.navigate('Gallery', { communityId })} 
            variant={isLocked ? "secondary" : "primary"}
          />
        </View>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  navBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  navTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  hero: { alignItems: 'center', marginVertical: 24 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroIconText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  memberText: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4FD1C5', marginLeft: 6 },
  activeText: { color: '#4FD1C5', fontSize: 12 },
  card: { marginHorizontal: 24, padding: 24, alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 },
  cyanIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4FD1C5', marginTop: 20 },
  cardSubtext: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', marginTop: 12 },
  inviteCard: { marginHorizontal: 24, marginTop: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inviteLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  inviteTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  inviteCode: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
  panel: { marginHorizontal: 24, marginTop: 16, padding: 24 },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  panelTitle: { color: '#fff', fontSize: 16, fontWeight: '600', flexShrink: 1 },
  panelSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8, marginLeft: 32 },
  revealedText: { color: '#4FD1C5', fontSize: 24, fontWeight: 'bold', marginVertical: 10 }
});