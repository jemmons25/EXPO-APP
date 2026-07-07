import { StyleSheet, View } from 'react-native';
import { colors, evidenceColor, EvidenceStrength, radius, spacing } from '@/theme';
import { Text } from './Text';

const labels: Record<EvidenceStrength, string> = {
  strong: 'Strong evidence',
  moderate: 'Moderate evidence',
  emerging: 'Emerging evidence',
  contested: 'Contested',
};

export function EvidenceChip({ strength, compact }: { strength: EvidenceStrength; compact?: boolean }) {
  const color = evidenceColor[strength];
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text variant="overline" color={color}>
        {compact ? strength : labels[strength]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    gap: 6,
    backgroundColor: colors.bgElevated,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
