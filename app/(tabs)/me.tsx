import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, PrimaryButton, Text } from '@/components';
import { colors, radius, scoreColor, spacing } from '@/theme';
import { useProfile } from '@/lib/profileContext';
import { fitzpatrickLabels } from '@/lib/solar';
import { leucineAnchors, proteinTarget } from '@/lib/nutrition';
import { HistoryEntry, loadHistory } from '@/lib/storage';

const BLOOD_PANELS = [
  { area: 'Testosterone', tests: 'Total & free testosterone, SHBG, LH', evidence: 'Sleep, resistance training, body-fat, and limiting alcohol are the strongest levers.' },
  { area: 'Thyroid', tests: 'TSH, free T3, free T4, TPO antibodies', evidence: 'Ask for the full panel, not just TSH — antibodies catch autoimmune causes.' },
  { area: 'Insulin / metabolic', tests: 'Fasting insulin, HbA1c, HOMA-IR, fasting glucose', evidence: 'Fasting insulin often shifts before glucose does — an early warning.' },
  { area: 'Cortisol', tests: 'AM cortisol (and diurnal if possible)', evidence: 'Morning light, sleep, and stress load are the main behavioral levers.' },
  { area: 'Vitamin D', tests: '25(OH)D', evidence: 'Ties directly to your sun protocol; supplement if low, especially in winter.' },
];

export default function MeScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const protein = proteinTarget(profile.weightKg, profile.age, profile.goals, profile.sex);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="h1">You</Text>

          {/* Profile summary */}
          <Card style={{ gap: spacing.sm }}>
            <Text variant="overline" color={colors.textSecondary}>
              Your profile
            </Text>
            <Text variant="h3">
              {profile.age} · {profile.sex === 'male' ? 'Male' : 'Female'} · {profile.weightKg} kg
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              {fitzpatrickLabels[profile.skinType]}
            </Text>
            <View style={styles.goalRow}>
              {profile.goals.map((g) => (
                <View key={g} style={styles.goalPill}>
                  <Text variant="overline" color={colors.teal}>
                    {g}
                  </Text>
                </View>
              ))}
            </View>
            <PrimaryButton
              label="Edit profile"
              variant="outline"
              onPress={() => router.push('/onboarding')}
              style={{ marginTop: spacing.sm }}
            />
          </Card>

          {/* Protein & leucine */}
          <Card>
            <Text variant="overline" color={colors.teal}>
              Protein & amino acids
            </Text>
            <Text variant="h3" style={{ marginTop: 6 }}>
              {protein.dailyGrams} g/day · {protein.perMealGrams} g/meal
            </Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: 6, marginBottom: spacing.md }}>
              {protein.note}
            </Text>
            <Text variant="overline" color={colors.textSecondary}>
              Leucine anchors (per-meal trigger ≈ 2.5–3 g)
            </Text>
            <View style={{ marginTop: spacing.sm, gap: spacing.sm }}>
              {leucineAnchors.map((a) => (
                <View key={a.food} style={styles.anchorRow}>
                  <Text variant="bodyMedium" style={{ flex: 1 }}>
                    {a.food}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {a.protein} g protein
                  </Text>
                  <Text variant="bodySemibold" color={a.leucine >= 2.5 ? colors.mint : colors.honey} style={styles.leu}>
                    {a.leucine} g leu
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Hormone / blood panels */}
          <Card>
            <Text variant="overline" color={colors.teal}>
              Hormone support · blood panels to request
            </Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: 6, marginBottom: spacing.md }}>
              Bring this to an informed conversation with your doctor — not self-treatment.
            </Text>
            <View style={{ gap: spacing.md }}>
              {BLOOD_PANELS.map((p) => (
                <View key={p.area} style={styles.panelBox}>
                  <Text variant="bodySemibold">{p.area}</Text>
                  <Text variant="caption" color={colors.teal}>
                    {p.tests}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    {p.evidence}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Scan history */}
          <Card>
            <Text variant="overline" color={colors.textSecondary}>
              Recent scans
            </Text>
            {history.length === 0 ? (
              <Text variant="body" color={colors.textTertiary} style={{ marginTop: spacing.sm }}>
                Nothing yet — scan a food to build your history.
              </Text>
            ) : (
              <View style={{ marginTop: spacing.sm }}>
                {history.slice(0, 8).map((h) => (
                  <View key={`${h.barcode}-${h.scannedAt}`} style={styles.histRow}>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium" numberOfLines={1}>
                        {h.name}
                      </Text>
                      {h.brand && (
                        <Text variant="caption" color={colors.textTertiary}>
                          {h.brand}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.scorePill, { borderColor: scoreColor(h.score) }]}>
                      <Text variant="bodySemibold" color={scoreColor(h.score)}>
                        {h.score}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Text variant="caption" color={colors.textTertiary} center>
            TrueHealth is educational and not a substitute for professional medical care.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120, gap: spacing.lg },
  goalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  goalPill: { backgroundColor: colors.tealDim, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  anchorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  leu: { minWidth: 64, textAlign: 'right' },
  panelBox: { backgroundColor: colors.bg, padding: spacing.md, borderRadius: radius.md, gap: 2 },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  scorePill: {
    minWidth: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
