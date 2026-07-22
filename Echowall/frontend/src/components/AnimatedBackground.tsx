import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: any; y: any }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    ));
    translateY.value = withDelay(delay, withRepeat(
      withTiming(-100, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    ));
  }, [delay]);

  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View 
      style={[
        { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(255,255,255,0.3)', left: x, top: y },
        animStyle
      ]} 
    />
  );
};

// We must import withSequence since we used it above
import { withSequence } from 'react-native-reanimated';

export default function AnimatedBackground() {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 2000
  }));

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={['#050505', '#1A1A2E', '#16213E']}
        style={StyleSheet.absoluteFillObject}
      />
      {particles.map(p => (
        <Particle key={p.id} delay={p.delay} size={p.size} x={p.x} y={p.y} />
      ))}
    </View>
  );
}
