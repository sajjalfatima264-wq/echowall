import { apiClient } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createEcho = async (communityId: number, message: string | null, theme: string, cardStyle: string, imageUrl: string | null, voiceUrl: string | null) => {
  const storedUser = await AsyncStorage.getItem('echowall_user');
  if (!storedUser) throw new Error('User not found');
  const userData = JSON.parse(storedUser);
  return apiClient.post('/echo/create', { 
    community_id: communityId, 
    user_id: userData.id, 
    message: message || null, 
    image_url: imageUrl, 
    voice_url: voiceUrl,
    theme, 
    card_style: cardStyle 
  });
};

export const getRevealedEchoes = async (communityId: number) => {
  const res = await apiClient.get(`/echo/status/${communityId}`);
  if (res.status === 'revealed') return res.echoes;
  return [];
};

export const toggleLike = async (echoId: number) => {
  const storedUser = await AsyncStorage.getItem('echowall_user');
  if (!storedUser) throw new Error('User not found');
  const userData = JSON.parse(storedUser);
  
  // FIX: Added empty object {} as the second argument
  return apiClient.post(`/echo/${echoId}/like?user_id=${userData.id}`, {});
};

export const uploadImage = async (base64: string) => {
  return apiClient.post('/echo/upload', { base64 });
};

export const uploadAudio = async (uri: string) => {
  // FIX: Removed the hardcoded typo, using the .env variable safely
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
  const baseUrl = API_URL.split('/api')[0];
  
  const formData = new FormData();
  formData.append('file', {
    uri: uri,
    name: 'voice.m4a',
    type: 'audio/m4a'
  } as any);

  const response = await fetch(`${baseUrl}/api/echo/upload-audio`, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!response.ok) throw new Error('Audio upload failed');
  return response.json();
};