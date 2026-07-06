import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface RingSpec {
  progress: number; // 0..1
  color: string;
  trackColor: string;
}

interface ActivityRingsProps {
  rings: RingSpec[]; // outer to inner
  size?: number;
  strokeWidth?: number;
  gap?: number;
}

function Ring({
  spec,
  radius,
  center,
  strokeWidth,
  delay,
}: {
  spec: RingSpec;
  radius: number;
  center: number;
  strokeWidth: number;
  delay: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(1, spec.progress), {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [spec.progress, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));
  void delay;

  return (
    <>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={spec.trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={spec.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </>
  );
}

export function ActivityRings({ rings, size = 140, strokeWidth = 12, gap = 4 }: ActivityRingsProps) {
  const center = size / 2;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {rings.map((spec, i) => {
          const radius = (size - strokeWidth) / 2 - i * (strokeWidth + gap);
          return (
            <Ring
              key={i}
              spec={spec}
              radius={radius}
              center={center}
              strokeWidth={strokeWidth}
              delay={i * 120}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export const defaultTracks = {
  sun: colors.amberDim,
  protein: colors.tealDim,
  clean: colors.mintDim,
};
