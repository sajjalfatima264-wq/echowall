import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '@/screens/SplashScreen';
import WelcomeScreen from '@/screens/WelcomeScreen';
import AuthScreen from '@/screens/AuthScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CreateCommunityScreen from '@/screens/CreateCommunityScreen';
import JoinCommunityScreen from '@/screens/JoinCommunityScreen';
import CommunityScreen from '@/screens/CommunityScreen';
import CommunitySettingsScreen from '@/screens/CommunitySettingsScreen';
import CreateEchoScreen from '@/screens/CreateEchoScreen';
import GalleryScreen from '@/screens/GalleryScreen';

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0B0B14',
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0B14' },
          animation: 'fade', 
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreateCommunity" component={CreateCommunityScreen} options={{ headerShown: false , headerTintColor: '#fff', headerStyle: { backgroundColor: '#0B0B14' }, headerTitle: 'Create Community' }} />
        <Stack.Screen name="JoinCommunity" component={JoinCommunityScreen} options={{ headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#0B0B14' }, headerTitle: 'Join Community' }} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="CommunitySettings" component={CommunitySettingsScreen} />
        <Stack.Screen name="CreateEcho" component={CreateEchoScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}