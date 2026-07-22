import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JoinCommunityScreen({ navigation }: RootStackScreenProps<'JoinCommunity'>) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      if (!storedUser) return navigation.replace('Welcome');
      const userData = JSON.parse(storedUser);
      await apiClient.post('/communities/join', { invite_code: inviteCode, user_id: userData.id });
      navigation.goBack();
    } catch (e: any) { Alert.alert("Error", e.toString()); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Input label="Invite Code" value={inviteCode} onChangeText={setInviteCode} placeholder="Enter 8-character code" />
      <Button title="Join" onPress={handleJoin} loading={loading} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#0B0B14', padding: 24 } });
