import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CommunitySettingsScreen({ route, navigation }: RootStackScreenProps<'CommunitySettings'>) {
  const insets = useSafeAreaInsets();
  const { communityId } = route.params;
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const commData = await apiClient.get(`/communities/${communityId}`);
      setCommunity(commData);
      const memData = await apiClient.get(`/communities/${communityId}/members`);
      setMembers(memData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const copyCode = async () => {
    if (!community) return;
    
    // Changed from copyAsync to setStringAsync
    await Clipboard.setStringAsync(community.invite_code);
    
    if (Platform.OS === 'web') {
      window.alert("Copied to clipboard!");
    } else {
      Alert.alert("Copied!", "Invite code copied to clipboard.");
    }
  };

  const shareCode = async () => {
    if (!community) return;
    const message = `Join my EchoWall community "${community.name}"! Use the invite code: ${community.invite_code}`;
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(message);
      window.alert("Copied to clipboard!");
    } else {
      await Share.share({ message });
    }
  };

  const handleLeave = async () => {
    const confirmLeave = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('echowall_user');
        if (!storedUser) return;
        const userData = JSON.parse(storedUser);
        
        // FIXED: Added the empty object {} as the second argument
        await apiClient.post(`/communities/${communityId}/leave?user_id=${userData.id}`, {});
        
        navigation.replace('Dashboard');
      } catch (e) {
        Alert.alert("Error", "Could not leave community.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Leave Community?\nYou will no longer see this community or its echoes.")) {
        confirmLeave();
      }
    } else {
      Alert.alert(
        "Leave Community?",
        "You will no longer see this community or its echoes.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Leave", style: 'destructive', onPress: confirmLeave }
        ]
      );
    }
  };

  if (loading || !community) {
    return <View style={styles.container}><Text style={{ color: '#fff' }}>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <LinearGradient colors={['rgba(123,110,246,0.2)', 'transparent']} style={styles.headerGradient} />
      
      {/* Header */}
      <View style={[styles.navHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Community Info Header */}
      <View style={styles.headerCard}>
        <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.heroIcon}>
          <Text style={styles.heroIconText}>{community.name.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <Text style={styles.communityName}>{community.name}</Text>
        <Text style={styles.metaText}>Reveal Time: {community.reveal_time}</Text>
        <Text style={styles.metaText}>{members.length} Members</Text>
      </View>

      {/* Invite Code Section */}
      <Text style={styles.sectionTitle}>Invite Code</Text>
      <View style={styles.codeCard}>
        <Text style={styles.codeText}>{community.invite_code}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={copyCode}>
          <Ionicons name="copy-outline" size={20} color="#7B6EF6" />
          <Text style={styles.actionBtnText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={shareCode}>
          <Ionicons name="share-outline" size={20} color="#7B6EF6" />
          <Text style={styles.actionBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Members List Section */}
      <Text style={styles.sectionTitle}>Members ({members.length})</Text>
      <View style={styles.membersList}>
        {members.map((member, index) => (
          <View key={index} style={[styles.memberItem, index === members.length - 1 && { borderBottomWidth: 0 }]}>
            <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.avatar}>
              <Text style={styles.avatarText}>{member.username.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <Text style={styles.memberName}>{member.username}</Text>
          </View>
        ))}
      </View>

      {/* Leave Community */}
      <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.leaveText}>Leave Community</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  navBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  navTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  headerCard: { alignItems: 'center', marginVertical: 24 },
  heroIcon: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroIconText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  communityName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  metaText: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  
  sectionTitle: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginHorizontal: 24, marginTop: 16 },
  codeCard: { marginHorizontal: 24, backgroundColor: 'rgba(79,209,197,0.1)', borderWidth: 1, borderColor: 'rgba(79,209,197,0.2)', padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  codeText: { color: '#4FD1C5', fontSize: 28, fontWeight: 'bold', letterSpacing: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginHorizontal: 24, gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  actionBtnText: { color: '#7B6EF6', fontWeight: '600', fontSize: 16 },
  
  membersList: { marginHorizontal: 24, backgroundColor: 'rgba(19,19,31,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 24, padding: 16, marginBottom: 30 },
  memberItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  memberName: { fontSize: 16, color: '#fff' },
  
  leaveBtn: { marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, backgroundColor: 'rgba(255,59,48,0.1)', borderRadius: 16, gap: 8, borderWidth: 1, borderColor: 'rgba(255,59,48,0.3)' },
  leaveText: { color: '#FF3B30', fontWeight: '600', fontSize: 16 }
});