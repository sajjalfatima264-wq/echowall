import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'error' | 'success' | 'info';
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('error');
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((msg: string, toastType: ToastType = 'error') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
    
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setVisible(false);
      });
    }, 3000);
  }, [fadeAnim]);

  const colors = {
    error: { bg: 'rgba(255, 59, 48, 0.15)', border: 'rgba(255, 59, 48, 0.4)', text: '#FF453A', icon: 'alert-circle' as const },
    success: { bg: 'rgba(48, 209, 88, 0.15)', border: 'rgba(48, 209, 88, 0.4)', text: '#30D158', icon: 'checkmark-circle' as const },
    info: { bg: 'rgba(123, 110, 246, 0.15)', border: 'rgba(123, 110, 246, 0.4)', text: '#7B6EF6', icon: 'information-circle' as const },
  };

  const c = colors[type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
          <View style={[styles.bubble, { backgroundColor: c.bg, borderColor: c.border }]}>
            <Ionicons name={c.icon} size={20} color={c.text} />
            <Text style={[styles.text, { color: c.text }]}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 80, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  text: { fontSize: 14, fontWeight: '600' }
});