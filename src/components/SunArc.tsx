import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Line } from 'react-native-svg';
import { colors } from '@/theme';
import { Text } from './Text';

interface SunArcProps {
  /** 0..1 progress of the sun across the day (sunrise→sunset). */
  dayProgress: number;
  /** Fraction of the arc [0..1] where the strong-UVB window sits. */
  uvbStart?: number;
  uvbEnd?: number;
  width?: number;
  height?: number;
  inWindow?: boolean;
}

/** Live sun arc across a horizon; glows amber during the UVB/vitamin-D window. */
export function SunArc({
  dayProgress,
  uvbStart = 0.35,
  uvbEnd = 0.65,
  width = 300,
  height = 120,
  inWindow = false,
}: SunArcProps) {
  const pad = 16;
  const w = width - pad * 2;
  const baseY = height - 24;
  const p = Math.max(0, Math.min(1, dayProgress));

  // Semicircle arc: y = baseY - sin(angle)*amplitude
  const amp = height - 44;
  const angleFor = (t: number) => Math.PI * t;
  const pointFor = (t: number) => ({
    x: pad + t * w,
    y: baseY - Math.sin(angleFor(t)) * amp,
  });

  const arcPath = (() => {
    let d = '';
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const { x, y } = pointFor(t);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  })();

  const windowPath = (() => {
    let d = '';
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
      const t = uvbStart + (uvbEnd - uvbStart) * (i / steps);
      const { x, y } = pointFor(t);
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  })();

  const sun = pointFor(p);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id="sunGlow" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.amberStart} />
            <Stop offset="1" stopColor={colors.amberEnd} />
          </SvgGradient>
        </Defs>
        {/* horizon */}
        <Line x1={pad} y1={baseY} x2={width - pad} y2={baseY} stroke={colors.borderSubtle} strokeWidth={1} />
        {/* full day arc (dim) */}
        <Path d={arcPath} stroke={colors.bgElevated2} strokeWidth={3} fill="none" />
        {/* UVB window (amber) */}
        <Path d={windowPath} stroke="url(#sunGlow)" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* sun */}
        <Circle cx={sun.x} cy={sun.y} r={inWindow ? 11 : 8} fill={colors.amberStart} opacity={0.25} />
        <Circle cx={sun.x} cy={sun.y} r={inWindow ? 7 : 5.5} fill={colors.amberEnd} />
      </Svg>
      <View style={styles.labels}>
        <Text variant="caption" color={colors.textTertiary}>
          Sunrise
        </Text>
        <Text variant="caption" color={inWindow ? colors.amberStart : colors.textTertiary}>
          Vitamin-D window
        </Text>
        <Text variant="caption" color={colors.textTertiary}>
          Sunset
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 2 },
});
