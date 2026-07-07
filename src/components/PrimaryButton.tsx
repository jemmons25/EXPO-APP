import { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors, radius, spacing, spring } from '@/theme';
import { Text } from './Text';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  /** Only the main CTA gets the idle shimmer. */
  cta?: boolean;
  variant?: 'solid' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function PrimaryButton({
  label,
  onPress,
  cta = false,
  variant = 'solid',
  style,
  disabled,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (cta && !disabled) {
      shimmer.value = withRepeat(withTiming(1, { duration: 2400 }), -1, false);
    }
  }, [cta, disabled, shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 0.35, 0]),
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-160, 160]) }],
  }));

  const press = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const isOutline = variant === 'outline';

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={press}
        onPressIn={() => (scale.value = withSpring(0.96, spring.snappy))}
        onPressOut={() => (scale.value = withSpring(1, spring.snappy))}
        disabled={disabled}
        style={[
          styles.base,
          isOutline ? styles.outline : styles.solid,
          disabled && styles.disabled,
        ]}
      >
        {!isOutline && cta && (
          <AnimatedGradient
            pointerEvents="none"
            colors={['transparent', colors.white, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle]}
          />
        )}
        <Text
          variant="bodySemibold"
          color={isOutline ? colors.teal : colors.textOnAccent}
          style={styles.label}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    overflow: 'hidden',
  },
  solid: { backgroundColor: colors.teal },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.teal },
  disabled: { opacity: 0.4 },
  shimmer: { width: 120 },
  label: { fontSize: 16 },
});
