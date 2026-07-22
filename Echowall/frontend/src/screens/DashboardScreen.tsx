import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getGradient } from '@/utils/gradients';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '@/components/GlassCard';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Helper to format ISO string to nice readable time
const formatRevealDate = (isoString: string) => {
  try {
    // FIX: If the string doesn't end with 'Z' (UTC marker), append it
    // so JavaScript knows it's a UTC date and converts to local time correctly.
    const dateStr = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "Scheduled";
  }
};

export default function DashboardScreen({ navigation }: RootStackScreenProps<'Dashboard'>) {
  const insets = useSafeAreaInsets();
  const [communities, setCommunities] = useState<any[]>([]);
  const [stats, setStats] = useState({ communities_count: 0, echoes_count: 0, reveals_today: 0 });
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      if (!storedUser) return navigation.replace('Welcome');
      const userData = JSON.parse(storedUser);
      setUsername(userData.username);
      
      const [communitiesData, statsData] = await Promise.all([
        apiClient.get(`/communities/?user_id=${userData.id}`),
        apiClient.get(`/users/${userData.id}/stats`)
      ]);
      
      setCommunities(communitiesData);
      setStats(statsData);
    } catch (e) {} finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [loading]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Find the community with the soonest reveal datetime
  const now = new Date();
  const upcomingReveals = communities.filter(c => {
    // FIX: Append 'Z' so JavaScript knows it's a UTC date
    const dateStr = c.reveal_datetime.endsWith('Z') ? c.reveal_datetime : `${c.reveal_datetime}Z`;
    return new Date(dateStr) > now;
  });
  
  const nextRevealCommunity = upcomingReveals.length > 0 
    ? [...upcomingReveals].sort((a, b) => {
        const dateA = a.reveal_datetime.endsWith('Z') ? a.reveal_datetime : `${a.reveal_datetime}Z`;
        const dateB = b.reveal_datetime.endsWith('Z') ? b.reveal_datetime : `${b.reveal_datetime}Z`;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      })[0] 
    : null;

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#7B6EF6" /></View>;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0a3e', 'transparent']} style={styles.headerGradient} />
      
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}, {username}</Text>
                <Text style={styles.username}>Your Echoes</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
                <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.avatar}>
                  <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard}>
                <Text style={styles.statValue}>{stats.communities_count}</Text>
                <Text style={styles.statLabel}>Communities</Text>
              </GlassCard>
              <GlassCard style={styles.statCard}>
                <Text style={styles.statValue}>{stats.echoes_count}</Text>
                <Text style={styles.statLabel}>Echo Cards</Text>
              </GlassCard>
              <GlassCard style={styles.statCard}>
                <Text style={styles.statValue}>{stats.reveals_today}</Text>
                <Text style={styles.statLabel}>Reveals Today</Text>
              </GlassCard>
            </View>

            {/* Next Reveal Banner */}
            {nextRevealCommunity && (
              <View style={styles.bannerContainer}>
                <LinearGradient 
                  colors={['rgba(123,110,246,0.2)', 'rgba(11,11,20,0)']} 
                  style={StyleSheet.absoluteFillObject} 
                />
                <GlassCard style={styles.bannerCard}>
                  <View style={styles.bannerContent}>
                    <View>
                      <Text style={styles.bannerLabel}>Next shared reveal</Text>
                      <Text style={styles.bannerTitle}>{nextRevealCommunity.name}</Text>
                      <View style={styles.bannerStatus}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>{formatRevealDate(nextRevealCommunity.reveal_datetime)}</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </View>
            )}

            {/* List Title */}
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Your communities</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          // Get the dynamic colors for this community
          const colors = getGradient(item.gradient);
          return (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
              <TouchableOpacity onPress={() => navigation.navigate('Community', { communityId: item.id })} activeOpacity={0.9}>
                <GlassCard style={styles.card}>
                  <View style={styles.cardHeader}>
                    {/* USE DYNAMIC COLORS HERE */}
                    <LinearGradient colors={colors} style={styles.iconBox}>
                      <Text style={styles.iconText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <View style={styles.memberRow}>
                        <Ionicons name="calendar-outline" size={10} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.cardSub}>{formatRevealDate(item.reveal_datetime)}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.cardFooter}>
                    <View style={styles.openPill}>
                      <Text style={styles.openPillText}>Open</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate('JoinCommunity')}>
          <Ionicons name="enter-outline" size={24} color="#fff" />
          <Text style={styles.bottomBtnText}>Join</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateCommunity')}>
          <Ionicons name="add" size={32} color="#fff" />
          <Text style={styles.bottomBtnText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  username: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  avatar: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', shadowColor: '#7B6EF6', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 16 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10, marginTop: 4 },
  bannerContainer: { marginBottom: 24 },
  bannerCard: { padding: 20, borderRadius: 24, overflow: 'hidden' },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bannerStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4FD1C5' },
  activeText: { color: '#4FD1C5', fontSize: 12, fontWeight: '600' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  seeAll: { color: '#7B6EF6', fontSize: 12 },
  card: { padding: 20, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  iconText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  openPill: { backgroundColor: 'rgba(123,110,246,0.1)', borderWidth: 1, borderColor: 'rgba(123,110,246,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  openPillText: { color: '#7B6EF6', fontSize: 11, fontWeight: '600' },
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, left: 0, right: 0, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 24, 
    paddingVertical: 16, 
    backgroundColor: 'rgba(11,11,20,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  bottomBtn: { alignItems: 'center', justifyContent: 'center', opacity: 0.7 },
  createBtn: { alignItems: 'center', justifyContent: 'center' },
  bottomBtnText: { color: '#fff', fontSize: 12, marginTop: 4, fontFamily: 'Outfit_600SemiBold' }
});