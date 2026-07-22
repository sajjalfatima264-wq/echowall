import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animations
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 1000, easing: Easing.out(Easing.exp), useNativeDriver: true })
    ]).start();

    const loop = (dot: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.timing(dot, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(dot, { toValue: 0.3, duration: 500, useNativeDriver: true })
    ]));
    loop(dot1, 0).start();
    loop(dot2, 200).start();
    loop(dot3, 400).start();

    let timer: ReturnType<typeof setTimeout>;

    const checkSession = async () => {
      const storedUser = await AsyncStorage.getItem('echowall_user');
      
      timer = setTimeout(() => {
        if (storedUser) {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('Welcome');
        }
      }, 3000);
    };

    checkSession();

    // Clear the timer properly on unmount
    return () => { if (timer) clearTimeout(timer); };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0a3e', '#0B0B14']} style={StyleSheet.absoluteFillObject} />
      
      <Animated.View style={[styles.logoContainer, { opacity: fade, transform: [{ scale }] }]}>
        <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.logoIcon}>
          <Text style={styles.logoText}>E</Text>
        </LinearGradient>
        <Text style={styles.title}>EchoWall</Text>
        <Text style={styles.tagline}>ANONYMOUS THOUGHTS. SHARED TOGETHER.</Text>
      </Animated.View>

      <View style={[styles.dotsContainer, { paddingBottom: insets.bottom + 24 }]}>
        <Animated.View style={[styles.dot, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14', justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center' },
  logoIcon: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#7B6EF6', shadowOpacity: 0.5, shadowRadius: 20 },
  logoText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  tagline: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2.5, marginTop: 8 },
  dotsContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7B6EF6' }
});