import React, { useEffect } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'delete';

interface ToastConfig {
  color: string;
  bg: string;
  border: string;
  icon: string;
}

const TOAST_TYPES: Record<ToastType, ToastConfig> = {
  success: { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: '✅' },
  error:   { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '❌' },
  info:    { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: 'ℹ️' },
  warning: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: '⚠️' },
  delete:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: '🗑️' },
};

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ visible, message, type = 'success', onHide }) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(-10, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        translateY.value = withTiming(100, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onHide)();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onHide, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const config = TOAST_TYPES[type];

  return (
    <Animated.View style={[styles.container, animatedStyle, {
      backgroundColor: config.bg,
      borderColor: config.border,
    }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.message, { color: config.color }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  icon: { fontSize: 20, marginRight: 12 },
  message: { fontSize: 15, fontWeight: '600', flex: 1 },
});

export default Toast;