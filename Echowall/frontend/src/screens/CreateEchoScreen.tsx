import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import ThemeSelector from '@/components/ThemeSelector';
import FontSelector from '@/components/FontSelector';
import EchoCard from '@/components/EchoCard';
import GradientButton from '@/components/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { createEcho, uploadImage, uploadAudio } from '@/services/echoService';

export default function CreateEchoScreen({ route, navigation }: RootStackScreenProps<'CreateEcho'>) {
  const insets = useSafeAreaInsets();
  const { communityId } = route.params;
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('Midnight');
  const [font, setFont] = useState('Modern');
  const [image, setImage] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(180); // 3 minutes
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && recordingTime > 0) {
      timerRef.current = setTimeout(() => setRecordingTime(prev => prev - 1), 1000);
    } else if (recordingTime === 0 && isRecording) {
      stopRecording();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRecording, recordingTime]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].base64);
    }
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permission needed", "Please allow microphone access.");
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(rec);
      setAudioUri(null);
      setRecordingTime(180);
      setIsRecording(true);
    } catch (e) { Alert.alert("Error", "Could not start recording"); }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) setAudioUri(uri);
    setRecording(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async () => {
    if (!message.trim() && !image && !audioUri) return;
    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        const uploadRes = await uploadImage(`data:image/jpeg;base64,${image}`);
        imageUrl = uploadRes.url;
      }
      
      let voiceUrl = null;
      if (audioUri) {
        const uploadRes = await uploadAudio(audioUri);
        voiceUrl = uploadRes.url;
      }
      
      await createEcho(communityId, message, theme, font, imageUrl, voiceUrl);
      navigation.goBack();
    } catch (e: any) { Alert.alert("Error", e.toString()); } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Echo</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.stepTitle}>What’s on your mind?</Text>
            <Text style={styles.stepSub}>Write, attach a photo, or record a voice note.</Text>
            
            <View style={styles.mediaRow}>
              <TouchableOpacity style={[styles.mediaBtn, image && styles.mediaBtnActive]} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color={image ? "#4FD1C5" : "rgba(255,255,255,0.6)"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.mediaBtn, isRecording && styles.recordingBtn]} 
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Ionicons name={isRecording ? "stop-circle" : "mic-outline"} size={20} color={isRecording ? "#FF3B30" : (audioUri ? "#4FD1C5" : "rgba(255,255,255,0.6)")} />
              </TouchableOpacity>

              {isRecording ? (
                <Text style={styles.recordingTimer}>{formatTime(recordingTime)}</Text>
              ) : (
                audioUri && (
                  <View style={styles.audioSavedContainer}>
                    <Ionicons name="checkmark-circle" size={18} color="#4FD1C5" />
                    <Text style={styles.audioSavedText}>Voice note ready</Text>
                    <TouchableOpacity style={styles.clearBtn} onPress={() => setAudioUri(null)}>
                      <Ionicons name="close-circle" size={16} color="#FF3B30" />
                      <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>

            {image && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.clearImgBtn} onPress={() => setImage(null)}>
                  <Ionicons name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Leave an anonymous thought…"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={280}
            />
            <Text style={styles.counter}>{message.length}/280</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.stepTitle}>Give it a feeling.</Text>
            <ThemeSelector selected={theme} onSelect={setTheme} />
          </View>

          <View style={styles.section}>
            <Text style={styles.stepTitle}>Choose a font.</Text>
            <FontSelector selected={font} onSelect={setFont} />
          </View>

          <View style={styles.section}>
            <Text style={styles.previewLabel}>Live Preview</Text>
            <EchoCard 
              message={message || "Your echo will look like this..."} 
              theme={theme} 
              font={font} 
              imageUrl={image ? `data:image/jpeg;base64,${image}` : null} 
              voiceUrl={audioUri} 
              likes={0} 
              onLike={() => {}} 
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <GradientButton title="Submit to Reveal" onPress={handleSubmit} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Outfit_700Bold' },
  section: { marginTop: 24 },
  stepTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', fontFamily: 'Outfit_600SemiBold' },
  stepSub: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4, marginBottom: 16, fontFamily: 'DMSans_400Regular' },
  mediaRow: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  mediaBtn: { width: 50, height: 50, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  mediaBtnActive: { borderColor: '#4FD1C5' },
  recordingBtn: { borderColor: '#FF3B30' },
  recordingTimer: { color: '#FF3B30', fontSize: 14, fontWeight: 'bold', fontFamily: 'Outfit_600SemiBold' },
  audioSavedContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(79,209,197,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(79,209,197,0.3)' },
  audioSavedText: { color: '#4FD1C5', fontSize: 12, fontWeight: '600', fontFamily: 'Outfit_600SemiBold', marginRight: 8 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clearText: { color: '#FF3B30', fontSize: 12, fontFamily: 'DMSans_400Regular' },
  previewContainer: { position: 'relative', marginBottom: 16 },
  imagePreview: { width: '100%', height: 200, borderRadius: 16 },
  clearImgBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, color: '#fff', fontSize: 16, minHeight: 100, textAlignVertical: 'top', fontFamily: 'DMSans_400Regular' },
  counter: { textAlign: 'right', color: 'rgba(255,255,255,0.4)', marginTop: 8, fontFamily: 'DMSans_400Regular' },
  previewLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'Outfit_600SemiBold' },
  footer: { padding: 24, backgroundColor: '#0B0B14', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }
});