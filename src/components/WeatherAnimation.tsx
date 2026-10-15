import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { WeatherGroup } from '../types';
import { Icon } from './Icon';

// Gentle moving weather behind the content: rain, snow, clouds, sun glow.
//
// How Reanimated works: a "shared value" (useSharedValue) is a number the
// animation engine changes 60 times a second, WITHOUT re-rendering React.
// useAnimatedStyle turns that number into a style (e.g. how far down a drop is).

// --- Falling rain drop or snowflake -------------------------------------------------

interface FallingProps {
  x: number; // Distance from the left edge
  delay: number; // ms before it starts, so they don't all fall together
  duration: number; // ms to fall from top to bottom
  screenHeight: number;
  kind: 'rain' | 'snow';
}

function Falling({ x, delay, duration, screenHeight, kind }: FallingProps) {
  const progress = useSharedValue(0); // 0 = top of screen, 1 = bottom

  useEffect(() => {
    // Go from 0 to 1, then jump back and repeat forever (-1).
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: progress.value * (screenHeight + 40) - 40 },
      // Snowflakes sway left and right as they fall.
      { translateX: kind === 'snow' ? Math.sin(progress.value * Math.PI * 4) * 12 : 0 },
    ],
  }));

  return (
    <Animated.View
      style={[kind === 'rain' ? styles.drop : styles.flake, { left: x }, style]}
    />
  );
}

// --- Drifting cloud ----------------------------------------------------------------

interface DriftingCloudProps {
  top: number;
  size: number;
  duration: number;
  start: number; // 0–1: where on screen it starts, so clouds are spread out
  screenWidth: number;
  opacity: number;
}

function DriftingCloud({ top, size, duration, start, screenWidth, opacity }: DriftingCloudProps) {
  const progress = useSharedValue(start);

  useEffect(() => {
    progress.value = withSequence(
      // First, finish the trip from the starting point...
      withTiming(1, { duration: duration * (1 - start), easing: Easing.linear }),
      // ...then repeat full trips forever: jump back to the left, drift right.
      withRepeat(
        withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration, easing: Easing.linear })),
        -1,
      ),
    );
  }, []);

  // progress 0 → just off the left edge (-size); progress 1 → just off the right edge.
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: -size + progress.value * (screenWidth + size * 2) }],
  }));

  return (
    <Animated.View style={[styles.absolute, { top, opacity }, style]}>
      <Icon name="cloud" size={size} color="#fff" />
    </Animated.View>
  );
}

// --- Pulsing glow (sun by day, moon by night) ---------------------------------------

function Glow({ color }: { color: string }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Grow and shrink forever. `true` = reverse direction each time (0→1→0→1...).
    pulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.25,
    transform: [{ scale: 1 + pulse.value * 0.12 }],
  }));

  return <Animated.View style={[styles.glow, { backgroundColor: color }, style]} />;
}

// --- Lightning flash for storms ------------------------------------------------------

function Lightning() {
  const flash = useSharedValue(0);

  useEffect(() => {
    flash.value = withRepeat(
      withSequence(
        withDelay(5000, withTiming(0.45, { duration: 70 })), // Wait, then flash
        withTiming(0, { duration: 250 }), // Fade out
        withTiming(0.3, { duration: 60 }), // A second, smaller flash
        withTiming(0, { duration: 300 }),
      ),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: flash.value }));
  return <Animated.View style={[StyleSheet.absoluteFill, styles.lightning, style]} />;
}

// --- Putting it together --------------------------------------------------------------

// How many rain drops and clouds each kind of weather gets.
// `Partial<Record<...>>` = an object that MAY have a number for each group.
const DROPS: Partial<Record<WeatherGroup, number>> = { drizzle: 18, rain: 40, storm: 55 };
const CLOUDS: Partial<Record<WeatherGroup, number>> = {
  cloudy: 3,
  fog: 4,
  drizzle: 2,
  rain: 2,
  storm: 2,
  snow: 1,
};

interface WeatherAnimationProps {
  group: WeatherGroup;
  isDay: boolean;
}

export function WeatherAnimation({ group, isDay }: WeatherAnimationProps) {
  const { width, height } = useWindowDimensions();
  // Respect the phone's "Reduce motion" / "Remove animations" accessibility setting.
  const reduceMotion = useReducedMotion();

  const dropCount = DROPS[group] ?? 0;
  const flakeCount = group === 'snow' ? 30 : 0;
  const cloudCount = CLOUDS[group] ?? 0;

  // Random positions are created ONCE (useState with a function), not on every render.
  const [drops] = useState(() =>
    Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      delay: Math.random() * 1500,
      duration: 650 + Math.random() * 450,
    })),
  );
  const [flakes] = useState(() =>
    Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      delay: Math.random() * 6000,
      duration: 6000 + Math.random() * 4000,
    })),
  );
  const [clouds] = useState(() =>
    Array.from({ length: cloudCount }, (_, i) => ({
      top: 60 + i * (height / 4) + Math.random() * 40,
      size: 90 + Math.random() * 70,
      duration: 45000 + Math.random() * 25000,
      start: Math.random(),
    })),
  );

  if (reduceMotion) return null;

  return (
    // pointerEvents 'none': taps go straight through to the content on top.
    <View style={[StyleSheet.absoluteFill, styles.noTouch]}>
      {group === 'clear' && <Glow color={isDay ? '#FFE680' : '#FFFFFF'} />}

      {clouds.map((cloud, i) => (
        <DriftingCloud
          key={`cloud-${i}`}
          {...cloud}
          screenWidth={width}
          opacity={group === 'fog' ? 0.3 : 0.18}
        />
      ))}

      {drops.map((drop, i) => (
        <Falling key={`drop-${i}`} {...drop} screenHeight={height} kind="rain" />
      ))}

      {flakes.map((flake, i) => (
        <Falling key={`flake-${i}`} {...flake} screenHeight={height} kind="snow" />
      ))}

      {group === 'storm' && <Lightning />}
    </View>
  );
}

const styles = StyleSheet.create({
  noTouch: {
    pointerEvents: 'none',
  },
  absolute: {
    position: 'absolute',
  },
  drop: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 18,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  flake: {
    position: 'absolute',
    top: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  glow: {
    position: 'absolute',
    top: -90,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  lightning: {
    backgroundColor: '#fff',
  },
});
