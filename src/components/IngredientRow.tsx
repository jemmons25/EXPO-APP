import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, flagToColor, radius, spacing } from '@/theme';
import { ParsedIngredient } from '@/lib/scoring';
import { Text } from './Text';
import { EvidenceChip } from './EvidenceChip';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function IngredientRow({ item, index }: { item: ParsedIngredient; index: number }) {
  const [open, setOpen] = useState(false);
  const info = item.info;
  const flag = info?.flag ?? 'green';
  const color = flagToColor[flag];
  const hasDetail = !!info;

  const toggle = () => {
    if (!hasDetail) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    setOpen((o) => !o);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify().damping(16)}>
      <Pressable onPress={toggle} style={styles.row}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View style={styles.main}>
          <Text variant="bodyMedium" numberOfLines={open ? undefined : 1} style={styles.name}>
            {info?.name ?? capitalize(item.raw)}
          </Text>
          {info?.whatItIs ? (
            <Text variant="caption" color={colors.textSecondary}>
              {open ? info.whatItIs : truncate(info.whatItIs, 60)}
            </Text>
          ) : (
            <Text variant="caption" color={colors.textTertiary}>
              Not in our risk database — treated as neutral
            </Text>
          )}
        </View>
        {hasDetail && (
          <Text variant="caption" color={colors.textTertiary}>
            {open ? '−' : '+'}
          </Text>
        )}
      </Pressable>

      {open && info && (
        <View style={styles.detail}>
          <Text variant="body" color={colors.textSecondary} style={styles.detailText}>
            {info.whatItDoes}
          </Text>
          {info.doseContext && (
            <Text variant="caption" color={colors.textTertiary} style={styles.detailText}>
              Context: {info.doseContext}
            </Text>
          )}
          <View style={styles.chips}>
            <EvidenceChip strength={info.evidence} />
          </View>
          {info.regulatory && info.regulatory.length > 0 && (
            <View style={styles.reg}>
              {info.regulatory.map((r, i) => (
                <Text key={i} variant="caption" color={colors.textTertiary}>
                  {jurisdiction(r.jurisdiction)}: {statusLabel(r.status)}
                  {r.detail ? ` — ${r.detail}` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function jurisdiction(j: string) {
  return (
    { US_FDA: 'US (FDA)', US_CA: 'California', EU: 'EU', UK: 'UK', CANADA: 'Canada', WHO: 'WHO' }[j] ?? j
  );
}
function statusLabel(s: string) {
  return (
    {
      allowed: 'allowed',
      allowed_limited: 'allowed (limited)',
      banned: 'banned',
      under_review: 'under review',
      warning_label: 'warning label required',
      voluntary_phaseout: 'phasing out',
    }[s] ?? s
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, gap: spacing.md },
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5 },
  main: { flex: 1, gap: 2 },
  name: {},
  detail: {
    marginLeft: spacing.md + 9,
    marginBottom: spacing.md,
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderSubtle,
    gap: spacing.sm,
  },
  detailText: {},
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: 2 },
  reg: { gap: 2, marginTop: 4, backgroundColor: colors.bg, padding: spacing.md, borderRadius: radius.md },
});
