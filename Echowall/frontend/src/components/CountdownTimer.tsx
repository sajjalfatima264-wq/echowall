import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  targetTime: string; 
  onDone?: () => void; // Added onDone prop here
}

export default function CountdownTimer({ targetTime, onDone }: CountdownTimerProps) {
  const [time, setTime] = useState(targetTime);

  useEffect(() => {
    let [h, m, s] = targetTime.split(':').map(Number);
    let total = h * 3600 + m * 60 + s;

    const interval = setInterval(() => {
      if (total > 0) {
        total -= 1;
        const hrs = Math.floor(total / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;
        setTime(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      } else {
        clearInterval(interval);
        // Call onDone when the timer hits zero!
        if (onDone) onDone(); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return <Text style={styles.timer}>Reveals in {time}</Text>;
}

const styles = StyleSheet.create({
  timer: { fontSize: 20, color: '#7B6EF6', fontWeight: 'bold', fontVariant: ['tabular-nums'], marginBottom: 8 }
});