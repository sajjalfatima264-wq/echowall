import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '@/components/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JoinCommunityScreen({ navigation }: RootStackScreenProps<'JoinCommunity'>) {
  const insets = useSafeAreaInsets();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter an invite code.");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      if (!storedUser) return navigation.replace('Welcome');
      const userData = JSON.parse(storedUser);
      
      await apiClient.post('/communities/join', { 
        invite_code: inviteCode.trim(), 
        user_id: userData.id 
      });
      
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", "Invalid invite code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Centered Content */}
        <View style={styles.content}>
          {/* Hero Icon */}
          <View style={styles.heroIconContainer}>
            <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.heroIcon}>
              <Ionicons name="enter-outline" size={32} color="#fff" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Got an invite code?</Text>
          <Text style={styles.subtext}>Enter the 8-character code shared by your friend to join their reveal.</Text>
          
          {/* Input with Icon */}
          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., xYz123Ab"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={8}
            />
          </View>
        </View>
      </ScrollView>

      {/* Pinned Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton title="Join Community" onPress={handleJoin} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'stretch' },
  heroIconContainer: { alignItems: 'center', marginBottom: 40 },
  heroIcon: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', shadowColor: '#7B6EF6', shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', fontFamily: 'Outfit_700Bold', textAlign: 'center', marginBottom: 12 },
  subtext: { color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', marginBottom: 32, fontFamily: 'DMSans_400Regular', lineHeight: 22 },
  
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 16, 
    paddingHorizontal: 16 
  },
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1,
    paddingVertical: 18, 
    color: '#fff', 
    fontSize: 18, 
    letterSpacing: 2,
    fontFamily: 'DMSans_400Regular' 
  },
  
  footer: { padding: 24, backgroundColor: '#0B0B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }
});