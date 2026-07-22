import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GradientButton from '@/components/GradientButton';
import GradientSelector from '@/components/GradientSelector';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateCommunityScreen({ navigation }: RootStackScreenProps<'CreateCommunity'>) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  
  // Default to 1 hour from now
  const initialDate = new Date(Date.now() + 3600000);
  const [date, setDate] = useState(initialDate);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [gradient, setGradient] = useState('Violet');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a community name.");
      return;
    }

    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      if (!storedUser) return navigation.replace('Welcome');
      const userData = JSON.parse(storedUser);
      
      const revealISO = date.toISOString();
      
      await apiClient.post(`/communities/create?user_id=${userData.id}`, {
        name,
        reveal_datetime: revealISO,
        gradient: gradient
      });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDateConfirm = (selectedDate: Date) => {
    const newDate = new Date(date);
    newDate.setFullYear(selectedDate.getFullYear());
    newDate.setMonth(selectedDate.getMonth());
    newDate.setDate(selectedDate.getDate());
    setDate(newDate);
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    const newDate = new Date(date);
    newDate.setHours(selectedTime.getHours());
    newDate.setMinutes(selectedTime.getMinutes());
    setDate(newDate);
    setShowTimePicker(false);
  };

  const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Community</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        {/* Custom Dark Mode Input */}
        <Text style={styles.label}>Community Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Late Night Coders"
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Reveal Date</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#7B6EF6" style={{ marginRight: 12 }} />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Reveal Time</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time-outline" size={20} color="#7B6EF6" style={{ marginRight: 12 }} />
          <Text style={styles.dateText}>{formattedTime}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Community Theme</Text>
        <GradientSelector selected={gradient} onSelect={setGradient} />
        
        <Text style={styles.hint}>
          The community will lock and reveal exactly on this date and time. It is a one-time event.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton title="Create" onPress={handleCreate} loading={loading} />
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        isDarkModeEnabled={true}
        date={date}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setShowTimePicker(false)}
        isDarkModeEnabled={true}
        date={date}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Outfit_700Bold' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 16, fontFamily: 'Outfit_600SemiBold' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 18, color: '#fff', fontSize: 16, fontFamily: 'DMSans_400Regular' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 18 },
  dateText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'DMSans_400Regular' },
  hint: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 16, lineHeight: 20, fontFamily: 'DMSans_400Regular' },
  footer: { padding: 24, backgroundColor: '#0B0B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }
});