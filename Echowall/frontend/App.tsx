import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/components/Toast';
import { useFonts } from 'expo-font';
import { Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Cinzel_700Bold } from '@expo-google-fonts/cinzel';

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    DMSans_400Regular,
    DancingScript_700Bold,
    Cinzel_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B6EF6" />
      </View>
    );
  }

  return (
    <ToastProvider>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#0B0B14', justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#0B0B14' },
});