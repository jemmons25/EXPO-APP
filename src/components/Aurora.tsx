import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/theme';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Time-of-day aurora background (docs/05 §1). Hue shifts with local hour:
 * cool blue at night → amber near sunrise/sunset → bright teal midday.
 * A slow drift keeps it alive. Approximated with layered gradients (Skia-free).
 */
function hueForHour(hour: number): [string, string, string] {
  if (hour < 5 || hour >= 21) return ['#0A0E14', '#0C1420', '#10202E']; // deep night
  if (hour < 8) return ['#0A0E14', '#241726', '#3A2417']; // sunrise amber
  if (hour < 11) return ['#0A0E14', '#0F2029', '#123539']; // morning teal
  if (hour < 16) return ['#0A0E14', '#0E2A2A', '#0F3A34']; // bright midday teal
  if (hour < 19) return ['#0A0E14', '#20212E', '#3A2A17']; // late-day amber
  return ['#0A0E14', '#161327', '#241726']; // dusk
}

export function Aurora({ hour }: { hour?: number }) {
  const h = hour ?? new Date().getHours();
  const drift = useSharedValue(0);
  const palette = useMemo(() => hueForHour(h), [h]);

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [drift]);

  const blobA = useAnimatedStyle(() => ({
    opacity: interpolate(drift.value, [0, 1], [0.35, 0.6]),
    transform: [
      { translateX: interpolate(drift.value, [0, 1], [-40, 30]) },
      { translateY: interpolate(drift.value, [0, 1], [-20, 20]) },
      { scale: interpolate(drift.value, [0, 1], [1, 1.25]) },
    ],
  }));
  const blobB = useAnimatedStyle(() => ({
    opacity: interpolate(drift.value, [0, 1], [0.5, 0.28]),
    transform: [
      { translateX: interpolate(drift.value, [0, 1], [40, -30]) },
      { translateY: interpolate(drift.value, [0, 1], [10, -30]) },
      { scale: interpolate(drift.value, [0, 1], [1.2, 0.95]) },
    ],
  }));

  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={palette}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <AnimatedGradient
        colors={[palette[2], 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.blob, styles.blobTop, blobA]}
      />
      <AnimatedGradient
        colors={[colors.tealDim, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.blob, styles.blobBottom, blobB]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', width: 380, height: 380, borderRadius: 190 },
  blobTop: { top: -120, right: -80 },
  blobBottom: { bottom: 40, left: -100 },
});
