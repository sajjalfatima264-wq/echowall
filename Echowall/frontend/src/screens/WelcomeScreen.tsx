import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientButton from '@/components/GradientButton';
import { RootStackScreenProps } from '@/navigation/types';
// Card configuration with depth (scale, opacity, zIndex)
const cardsConfig = [
  // Back Layer (Far away, faded, small) - Scattered top & middle
  { x: "15%", y: "5%", rotate: 12, scale: 0.65, colors: ['#1C1C2E', '#2D2D44'], text: "I'm not lazy, I'm on energy-saving mode.", zIndex: 0, opacity: 0.4 },
  { x: "55%", y: "12%", rotate: -8, scale: 0.39, colors: ['#667EEA', '#764BA2', '#F687B3'], text: "Procrastination is my favorite cardio.", zIndex: 0, opacity: 0.4 },
  { x: "75%", y: "40%", rotate: 5, scale: 0.33, colors: ['#FF6B6B', '#FFE66D', '#FF8E53'], text: "99 bugs in the code...", zIndex: 0, opacity: 0.4 },
  
  // Mid Layer (Medium distance) - Framing the center
  { x: "-8%", y: "25%", rotate: 6, scale: 0.55, colors: ['#134E5E', '#71B280'], text: "I put my phone on airplane mode so my anxiety can fly away.", zIndex: 1, opacity: 0.7 },
  { x: "35%", y: "35%", rotate: -4, scale: 2.0 , colors: ['#0B0B14', '#1a1a4e', '#2D1B69'], text: "Ohh..FOOD", zIndex: 1, opacity: 0.6 }, // Right in the middle!
  { x: "75%", y: "15%", rotate: -10, scale: 0.6, colors: ['#667EEA', '#764BA2', '#F687B3'], text: "I run on coffee and inappropriate thoughts.", zIndex: 1, opacity: 0.8 },

  // Front Layer (Close, sharp, large) - Edges and center
  { x: "-12%", y: "12%", rotate: -8, scale: 1.0, colors: ['#FF6B6B', '#FFE66D', '#FF8E53'], text: "My code works and I don't know why.", zIndex: 2, opacity: 1.0 },
  { x: "60%", y: "45%", rotate: 8, scale: 0.85, colors: ['#1C1C2E', '#2D2D44'], text: "Math test? I can't even count my problems.", zIndex: 2, opacity: 1.0 },
  { x: "35%", y: "20%", rotate: -5, scale: 0.8, colors: ['#134E5E', '#71B280'], text: "Ctrl+C, Ctrl+V, Pray.", zIndex: 2, opacity: 1.0 }
];
const FloatingCard = ({ x, y, rotate, scale, colors, text, zIndex, opacity }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 2500 + Math.random() * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 2500 + Math.random() * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.floatingCard, 
        { 
          left: x, 
          top: y, 
          opacity, 
          zIndex, 
          transform: [{ translateY }, { rotate: `${rotate}deg` }, { scale }] 
        }
      ]}
    >
      <LinearGradient colors={colors} style={styles.cardGradient}>
        <Text style={styles.cardText}>{text}</Text>
        <Text style={styles.cardFooter}>❤️ Anonymous</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 800, delay: 200, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a0a3e', '#0B0B14']} style={StyleSheet.absoluteFillObject} />
      
      {/* Floating Cards Background */}
      <View style={StyleSheet.absoluteFillObject}>
        {cardsConfig.map((card, index) => (
          <FloatingCard key={index} {...card} />
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }], paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.brandRow}>
          <LinearGradient colors={['#7B6EF6', '#4FD1C5']} style={styles.brandIcon}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>E</Text>
          </LinearGradient>
          <Text style={styles.brandText}>EchoWall</Text>
        </View>
        
        <Text style={styles.title}>Welcome to{"\n"}EchoWall</Text>
        <Text style={styles.subtitle}>Create anonymous communities. Share beautiful Echo Cards. Reveal them together.</Text>
        
        <View style={styles.buttons}>
          <GradientButton title="Get Started" onPress={() => navigation.navigate('Auth')} />
          <View style={{ height: 12 }} />
          <GradientButton title="Learn More" onPress={() => navigation.navigate('Auth')} variant="secondary" />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B14' },
  floatingCard: { position: 'absolute', width: 140, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  cardGradient: { borderRadius: 16, padding: 12 },
  cardText: { color: '#fff', fontSize: 9, fontWeight: '600', lineHeight: 14 },
  cardFooter: { color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 8 },
  content: { flex: 1, justifyContent: 'flex-end', padding: 28, zIndex: 99 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  brandIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 34, fontWeight: 'bold', lineHeight: 38 },
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 22, marginTop: 16, marginBottom: 32 },
  buttons: { width: '100%' }
});
