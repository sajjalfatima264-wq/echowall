import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '@/components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }: RootStackScreenProps<'Profile'>) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('echowall_user');
    navigation.replace('Welcome');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = async () => {
      try {
        if (!user) return;
        await apiClient.delete(`/users/${user.id}`);
        await AsyncStorage.removeItem('echowall_user');
        navigation.replace('Welcome');
      } catch (e: any) {
        Alert.alert("Error", "Could not delete account.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Delete Account?\nThis will permanently delete your account, your Echoes, and your community memberships.")) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Delete Account?",
        "This will permanently delete your account, your Echoes, and your community memberships.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: 'destructive', onPress: confirmDelete }
        ]
      );
    }
  };

  if (!user) return <View style={styles.container}><Text style={{color:'#fff'}}>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <LinearGradient colors={['rgba(123,110,246,0.2)', 'transparent']} style={styles.headerGradient} />
      
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.hero}>
        <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.heroIcon}>
          <Text style={styles.heroIconText}>{user.username.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <Text style={styles.heroTitle}>{user.username}</Text>
        <Text style={styles.metaText}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#7B6EF6" style={styles.listIcon} />
          <Text style={styles.listText}>Log Out</Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, { marginTop: 12 }]} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" style={styles.listIcon} />
          <Text style={[styles.listText, { color: '#FF3B30' }]}>Delete Account</Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
      </View>
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
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  metaText: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  
  section: { marginHorizontal: 24, marginTop: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(19,19,31,0.7)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 16, 
    padding: 18 
  },
  listIcon: { marginRight: 14 },
  listText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '500' }
});