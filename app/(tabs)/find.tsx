import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, Text } from '@/components';
import { colors, radius, spacing } from '@/theme';
import { SAMPLE_SOURCES, SOURCE_CATEGORIES, SourceCategory } from '@/data/foodSources';
import {
  RAW_MILK_BENEFITS,
  RAW_MILK_LAWS,
  RAW_MILK_RISKS,
  RawMilkTier,
  tierLabel,
} from '@/data/rawMilk';
import { useProfile } from '@/lib/profileContext';

const tierColor: Record<RawMilkTier, string> = {
  retail: colors.mint,
  on_farm: colors.teal,
  herd_share: colors.honey,
  pet_food_only: colors.honey,
  illegal: colors.coral,
};

export default function FindScreen() {
  const { profile } = useProfile();
  const [selected, setSelected] = useState<SourceCategory | 'all'>('all');
  const [stateCode, setStateCode] = useState<string>('CA');

  const sources = useMemo(
    () => (selected === 'all' ? SAMPLE_SOURCES : SAMPLE_SOURCES.filter((s) => s.category === selected)),
    [selected],
  );

  const law = RAW_MILK_LAWS.find((l) => l.code === stateCode);
  void profile;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="h1">Find real food</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Whole-food sources near you — with honest legality and risk info.
          </Text>

          {/* Category chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label="All" active={selected === 'all'} onPress={() => setSelected('all')} />
            {SOURCE_CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                label={`${c.emoji} ${c.label}`}
                active={selected === c.key}
                onPress={() => setSelected(c.key)}
              />
            ))}
          </ScrollView>

          {/* Map placeholder */}
          <Card style={styles.mapPlaceholder} padded={false}>
            <View style={styles.mapInner}>
              <Text style={styles.mapPin}>◈</Text>
              <Text variant="caption" color={colors.textSecondary} center>
                Map view uses your location + USDA Local Food Directories and community listings.
              </Text>
            </View>
          </Card>

          {/* Listings */}
          <View style={{ gap: spacing.md }}>
            {sources.map((s, i) => (
              <Animated.View key={s.id} entering={FadeInDown.delay(i * 50).springify().damping(16)}>
                <Card>
                  <View style={styles.rowBetween}>
                    <Text variant="h3" style={{ flex: 1 }}>
                      {catEmoji(s.category)} {s.name}
                    </Text>
                    <Text variant="caption" color={colors.textTertiary}>
                      {s.distanceMi.toFixed(1)} mi
                    </Text>
                  </View>
                  <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
                    {s.note}
                  </Text>
                  <View style={styles.badges}>
                    {s.badges.map((b) => (
                      <View key={b} style={styles.badge}>
                        <Text variant="overline" color={colors.mint}>
                          ✓ {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>

          {/* Raw milk legality */}
          <Card style={{ marginTop: spacing.sm }}>
            <Text variant="overline" color={colors.honey}>
              Raw milk · know your state law
            </Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>
              Federal law bans interstate raw-milk sale for human consumption. Drinking it is legal everywhere; sale
              rules vary by state.
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {RAW_MILK_LAWS.map((l) => (
                <Chip key={l.code} label={l.code} active={stateCode === l.code} onPress={() => setStateCode(l.code)} />
              ))}
            </ScrollView>

            {law && (
              <View style={styles.lawBox}>
                <View style={styles.rowBetween}>
                  <Text variant="bodySemibold">{law.name}</Text>
                  <View style={[styles.tierPill, { backgroundColor: tierColor[law.tier] + '22' }]}>
                    <Text variant="overline" color={tierColor[law.tier]}>
                      {tierLabel[law.tier]}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.rbRow}>
              <View style={styles.rbCol}>
                <Text variant="overline" color={colors.mint}>
                  Claimed benefits
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {RAW_MILK_BENEFITS}
                </Text>
              </View>
              <View style={styles.rbCol}>
                <Text variant="overline" color={colors.coral}>
                  Documented risks
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {RAW_MILK_RISKS}
                </Text>
              </View>
            </View>
            <Text variant="caption" color={colors.textTertiary} style={{ marginTop: spacing.md }}>
              Laws change — verify with your state Dept. of Agriculture. Educational, not medical or legal advice.
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.tealDim, borderColor: colors.teal }]}
    >
      <Text variant="caption" color={active ? colors.teal : colors.textSecondary}>
        {label}
      </Text>
    </Pressable>
  );
}

function catEmoji(cat: SourceCategory) {
  return SOURCE_CATEGORIES.find((c) => c.key === cat)?.emoji ?? '•';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120, gap: spacing.lg },
  chips: { gap: spacing.sm, paddingVertical: spacing.sm, paddingRight: spacing.xl },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.bgElevated,
  },
  mapPlaceholder: { height: 160, overflow: 'hidden' },
  mapInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.bgElevated2,
  },
  mapPin: { fontSize: 40, color: colors.teal },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  badge: { backgroundColor: colors.mintDim, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  lawBox: { marginTop: spacing.md, marginBottom: spacing.sm },
  tierPill: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  rbRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  rbCol: { flex: 1, gap: 4 },
});
