import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, Text } from 'react-native';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width * 0.55;

// Fiecare pas = ce procent din bară reprezintă
const STEP_PROGRESS: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 0.35, // tokeni cititi din storage
  2: 0.70, // sesiune validata cu /me
  3: 1.00, // FCM + gata
};

const STEP_MESSAGES: Record<0 | 1 | 2 | 3, string> = {
  0: 'Se pornește aplicația...',
  1: 'Se verifică sesiunea...',
  2: 'Se încarcă profilul...',
  3: 'Aproape gata...',
};

interface SplashScreenLoaderProps {
  loadingStep: 0 | 1 | 2 | 3;
}

export default function SplashScreenLoader({ loadingStep }: SplashScreenLoaderProps) {
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim    = useRef(new Animated.Value(0.4)).current;

  // Logo: apare o singură dată la mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsatie subtila pe logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Bara: avansează la fiecare schimbare de step
  useEffect(() => {
    const targetProgress = STEP_PROGRESS[loadingStep];

    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 500, // tranziție lină între pași
      useNativeDriver: false,
    }).start();
  }, [loadingStep]);

  const progressWidth = progressAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, BAR_WIDTH],
  });

  return (
    <View className="flex-1 items-center justify-center bg-[#0D0D1A]">
      {/* ── Logo + titlu ── */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        className="items-center mb-20"
      >
        {/* Glow pulsatoriu */}
        <Animated.View
          style={{ opacity: glowAnim }}
          className="absolute w-24 h-24 rounded-3xl bg-violet-500/30 -z-10"
        />

        <View className="w-20 h-20 rounded-2xl bg-violet-600 items-center justify-center mb-5"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Text className="text-white text-4xl">✦</Text>
        </View>

        <Text className="text-white text-3xl font-bold tracking-wide">
          MyApp
        </Text>
      </Animated.View>

      {/* ── Progress bar + mesaj ── */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute bottom-20 items-center"
      >
        {/* Mesaj dinamic */}
        <Text className="text-slate-400 text-sm mb-3 tracking-wider">
          {STEP_MESSAGES[loadingStep]}
        </Text>

        {/* Track */}
        <View
          style={{ width: BAR_WIDTH }}
          className="h-1 rounded-full bg-white/10 overflow-hidden"
        >
          {/* Fill */}
          <Animated.View
            style={{
              width: progressWidth,
              shadowColor: '#7C3AED',
              shadowOpacity: 0.9,
              shadowRadius: 6,
            }}
            className="h-full rounded-full bg-violet-500"
          />
        </View>

        {/* Dots */}
        <View className="flex-row gap-1.5 mt-4">
          {([0, 1, 2] as const).map((i) => (
            <BounceDot key={i} delay={i * 180} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

// ── Dot animat cu bounce ──────────────────────────────────
interface BounceDotProps {
  delay: number;
}

function BounceDot({ delay }: BounceDotProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -6,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(300),
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{ transform: [{ translateY: bounceAnim }] }}
      className="w-1.5 h-1.5 rounded-full bg-violet-400/70"
    />
  );
}