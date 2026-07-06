import { useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, fonts, scoreBand, scoreColor } from '@/theme';
import { Text } from './Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ScoreRingProps {
  score: number; // 0..100
  size?: number;
  strokeWidth?: number;
  showBand?: boolean;
}

/**
 * Circular clean-score ring. Counts up on reveal, morphs coral→honey→teal,
 * haptic tick when it settles. See docs/05 §4.
 */
export function ScoreRing({ score, size = 168, strokeWidth = 14, showBand = true }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);
  const target = Math.max(0, Math.min(100, score));

  useEffect(() => {
    progress.value = withTiming(
      target,
      { duration: 1100, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(Haptics.selectionAsync)();
      },
    );
  }, [target, progress]);

  const circleProps = useAnimatedProps(() => {
    const pct = progress.value / 100;
    return {
      strokeDashoffset: circumference * (1 - pct),
      stroke: interpolateColor(
        progress.value,
        [0, 39, 59, 79, 100],
        [colors.coral, colors.coral, colors.honey, colors.mint, colors.teal],
      ),
    };
  });

  const textProps = useAnimatedProps(() => {
    return { text: String(Math.round(progress.value)), defaultValue: '0' } as never;
  });

  const finalColor = scoreColor(target);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.bgElevated2}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={circleProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <AnimatedTextInput
          editable={false}
          animatedProps={textProps}
          style={[styles.number, { color: finalColor, fontSize: size * 0.3 }]}
        />
        {showBand && (
          <Text variant="overline" color={colors.textSecondary}>
            {scoreBand(target)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  number: { fontFamily: fonts.numeral, padding: 0, textAlign: 'center', minWidth: 90 },
});
