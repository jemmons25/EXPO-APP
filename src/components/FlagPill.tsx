import { StyleSheet, View } from 'react-native';
import { FlagColor, flagToColor, flagToDim, radius, spacing } from '@/theme';
import { Text } from './Text';

const label: Record<FlagColor, string> = { green: 'Clean', yellow: 'Caution', red: 'Flagged' };

export function FlagPill({ flag }: { flag: FlagColor }) {
  return (
    <View style={[styles.pill, { backgroundColor: flagToDim[flag] }]}>
      <View style={[styles.dot, { backgroundColor: flagToColor[flag] }]} />
      <Text variant="overline" color={flagToColor[flag]}>
        {label[flag]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
    gap: 5,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
