import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Moon, Sun } from "lucide-react-native";

interface ThemeToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export default function ThemeToggle({ value, onValueChange }: ThemeToggleProps) {
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;
  const bgAnim    = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
    }).start();

    Animated.timing(bgAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  // Track: light = slate-200, dark = sky-500
  const trackBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e2e8f0", "#572564"],
  });

  // Thumb slides from left (4px) to right (26px)
  const thumbTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 34],
  });

  // Icon fade
  const sunOpacity  = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const moonOpacity = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={styles.pressable}
    >
      {/* Track */}
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX: thumbTranslate }] },
          ]}
        >
          {/* Sun icon (light mode) */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, { opacity: sunOpacity }]}>
            <Sun size={13} color="#f59e0b" strokeWidth={2.5} />
          </Animated.View>

          {/* Moon icon (dark mode) */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.iconCenter, { opacity: moonOpacity }]}>
            <Moon size={13} color="#572564" strokeWidth={2.5} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const TRACK_W  = 60;
const TRACK_H  = 27;
const THUMB_SZ = 21;

const styles = StyleSheet.create({
  pressable: {
    // gives a comfortable tap target
    padding: 2,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: "center",
    // subtle inner shadow via border
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  thumb: {
    width: THUMB_SZ,
    height: THUMB_SZ,
    borderRadius: THUMB_SZ / 2,
    backgroundColor: "#ffffff",
    // drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
  iconCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
});