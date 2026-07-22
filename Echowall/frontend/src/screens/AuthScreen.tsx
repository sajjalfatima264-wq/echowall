import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '@/components/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/navigation/types';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '@/components/Toast';

export default function AuthScreen({ navigation }: RootStackScreenProps<'Auth'>) {
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const fade = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }, []);
  
  useEffect(() => {
    Animated.spring(checkScale, { toValue: password.length >= 6 ? 1 : 0, useNativeDriver: true }).start();
  }, [password]);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) return;
    
    setLoading(true);
    try {
      const endpoint = isLogin ? '/users/login' : '/users/register';
      const payload = isLogin 
        ? { email, password } 
        : { username, email, password };
        
      const user = await apiClient.post(endpoint, payload);
      await AsyncStorage.setItem('echowall_user', JSON.stringify({ id: user.id, username: user.username }));
      navigation.replace('Dashboard');
    } catch (e: any) {
      const errorMsg = typeof e === 'string' ? e : 'Invalid email or password. Please try again.';
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a0a3e', '#0B0B14']} style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <Animated.View style={[styles.content, { opacity: fade, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.iconTile}>
            <Ionicons name="sparkles" size={24} color="#7B6EF6" />
          </View>
          
          <Text style={styles.title}>{isLogin ? "Welcome back." : "Create an account."}</Text>
          <Text style={styles.subtitle}>{isLogin ? "Log in to continue to EchoWall." : "Join the anonymous community today."}</Text>
          
          {!isLogin && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
              <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.checkGradient}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </LinearGradient>
            </Animated.View>
          </View>

          <View style={{ marginTop: 16 }}>
            <GradientButton title={isLogin ? "Login" : "Sign Up"} onPress={handleAuth} loading={loading} />
          </View>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.toggleLink}>{isLogin ? "Sign up" : "Log in"}</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 28 },
  iconTile: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(123,110,246,0.1)', borderWidth: 1, borderColor: 'rgba(123,110,246,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { color: '#fff', fontSize: 30, fontWeight: 'bold', lineHeight: 34 },
  subtitle: { color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 8, marginBottom: 32 },
  inputContainer: { position: 'relative', marginBottom: 16 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 18, color: '#fff', fontSize: 16 },
  checkCircle: { position: 'absolute', right: 14, top: 14, width: 28, height: 28 },
  checkGradient: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  toggleContainer: { alignItems: 'center', marginTop: 24 },
  toggleText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  toggleLink: { color: '#7B6EF6', fontWeight: 'bold' }
});