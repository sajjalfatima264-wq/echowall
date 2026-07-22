import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity, Alert } from 'react-native';
import CountdownTimer from '@/components/CountdownTimer';
import Button from '@/components/Button';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ route, navigation }: RootStackScreenProps<'Home'>) {
  const communityId = route.params?.communityId;
  const [statusData, setStatusData] = useState<any>(null);
  const [communityData, setCommunityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!communityId) return;
    try {
      const data = await apiClient.get(`/echo/status/${communityId}`);
      setStatusData(data);
    } catch (error) {
      console.error("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunity = async () => {
    if (!communityId) return;
    try {
      const data = await apiClient.get(`/community/${communityId}`);
      setCommunityData(data);
    } catch (error) {
      console.error("Failed to fetch community");
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchCommunity();
  }, []);

  const onShare = async () => {
    if (!communityData) return;
    try {
      await Share.share({
        message: `Join my EchoWall community "${communityData.name}"! Use the invite code: ${communityData.invite_code}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleLeave = async () => {
    Alert.alert(
      "Leave Community?",
      "You will need the invite code to rejoin.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('echowall_user');
          navigation.replace('Welcome');
        }}
      ]
    );
  };

  if (!communityId) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20, color: 'red' }}>Error: Community ID missing.</Text>
        <Button title="Back to Welcome" onPress={() => navigation.replace('Welcome')} />
      </View>
    );
  }

  if (loading || !statusData) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  const isLocked = statusData.status === 'locked';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.communityName}>{communityData?.name || 'EchoWall'}</Text>
        <TouchableOpacity onPress={handleLeave} style={styles.leaveBtn}>
          <Ionicons name="log-out-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Share Invite Code Section */}
      {communityData && (
        <TouchableOpacity style={styles.shareCard} onPress={onShare}>
          <Ionicons name="people-circle-outline" size={24} color="#6C63FF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.shareTitle}>Invite Friends</Text>
            <Text style={styles.shareCode}>Code: {communityData.invite_code}</Text>
          </View>
          <Ionicons name="share-outline" size={20} color="#6C63FF" />
        </TouchableOpacity>
      )}

      <View style={styles.statusCard}>
        {isLocked ? (
          <>
            <Text style={styles.lockedEmoji}>🔒</Text>
            <CountdownTimer targetTime={statusData.remaining_time} onDone={fetchStatus} />
            <Text style={styles.subtext}>Echoes are currently hidden.</Text>
          </>
        ) : (
          <>
            <Text style={styles.lockedEmoji}>✨</Text>
            <Text style={styles.revealedText}>Today's Echoes are available!</Text>
            <Button title="View Gallery" onPress={() => navigation.navigate('Gallery', { communityId })} />
          </>
        )}
      </View>

      {isLocked && (
        <Button title="Create Echo" onPress={() => navigation.navigate('CreateEcho', { communityId })} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 24, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  communityName: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  leaveBtn: { padding: 8 },
  shareCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginTop: 16, borderWidth: 1, borderColor: '#eee' },
  shareTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  shareCode: { fontSize: 12, color: '#999', marginTop: 2 },
  statusCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginVertical: 20 },
  lockedEmoji: { fontSize: 48, marginBottom: 12 },
  subtext: { color: '#999', marginTop: 8 },
  revealedText: { fontSize: 18, fontWeight: 'bold', color: '#6C63FF', marginBottom: 16, textAlign: 'center' }
});
