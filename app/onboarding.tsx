import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { Aurora, PrimaryButton, Text } from '@/components';
import { colors, radius, spacing } from '@/theme';
import { useProfile } from '@/lib/profileContext';
import { Fitzpatrick, fitzpatrickLabels } from '@/lib/solar';
import { Goal, Sex } from '@/lib/storage';

const GOALS: { key: Goal; label: string; emoji: string }[] = [
  { key: 'longevity', label: 'Longevity', emoji: '⏳' },
  { key: 'hormones', label: 'Hormone health', emoji: '⚡' },
  { key: 'muscle', label: 'Build muscle', emoji: '💪' },
  { key: 'metabolic', label: 'Metabolic health', emoji: '🔥' },
  { key: 'energy', label: 'More energy', emoji: '☀️' },
];

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name ?? '');
  const [goals, setGoals] = useState<Goal[]>(profile.goals);
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [age, setAge] = useState(String(profile.age));
  const [weight, setWeight] = useState(String(profile.weightKg));
  const [skin, setSkin] = useState<Fitzpatrick>(profile.skinType);

  const next = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      await updateProfile({
        name: name.trim() || undefined,
        goals: goals.length ? goals : ['longevity'],
        sex,
        age: clampNum(age, 13, 100, 30),
        weightKg: clampNum(weight, 30, 250, 75),
        skinType: skin,
        onboarded: true,
      });
      router.replace('/(tabs)');
    }
  };

  const toggleGoal = (g: Goal) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  return (
    <View style={styles.root}>
      <Aurora hour={new Date().getHours()} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.dots}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <Animated.View entering={FadeIn} style={styles.stepWrap}>
              <Text variant="display">TrueHealth</Text>
              <Text variant="bodyLg" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
                Maximize your healthspan with recommendations graded by real evidence — food scanning, sun and protein
                protocols, and the science behind them. No fear-mongering, no dogma.
              </Text>
              <View style={{ marginTop: spacing.xxl }}>
                <Text variant="overline" color={colors.textSecondary}>
                  What should we call you? (optional)
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.textTertiary}
                  style={styles.input}
                />
              </View>
            </Animated.View>
          )}

          {step === 1 && (
            <Animated.View entering={FadeInRight.springify().damping(16)} style={styles.stepWrap}>
              <Text variant="h1">What are you optimizing for?</Text>
              <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
                Pick any that apply — this tailors your protocols.
              </Text>
              <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
                {GOALS.map((g) => {
                  const active = goals.includes(g.key);
                  return (
                    <Pressable
                      key={g.key}
                      onPress={() => toggleGoal(g.key)}
                      style={[styles.choice, active && styles.choiceActive]}
                    >
                      <Text style={styles.choiceEmoji}>{g.emoji}</Text>
                      <Text variant="h3" color={active ? colors.teal : colors.textPrimary} style={{ flex: 1 }}>
                        {g.label}
                      </Text>
                      <Text variant="h3" color={active ? colors.teal : colors.textTertiary}>
                        {active ? '✓' : '＋'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View entering={FadeInRight.springify().damping(16)} style={styles.stepWrap}>
              <Text variant="h1">A few basics</Text>
              <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
                Used for your protein and sun targets.
              </Text>
              <View style={{ marginTop: spacing.xl, gap: spacing.xl }}>
                <View>
                  <Text variant="overline" color={colors.textSecondary}>
                    Sex (for hormone & protein defaults)
                  </Text>
                  <View style={styles.segRow}>
                    {(['male', 'female'] as Sex[]).map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => setSex(s)}
                        style={[styles.seg, sex === s && styles.segActive]}
                      >
                        <Text variant="bodyMedium" color={sex === s ? colors.textOnAccent : colors.textSecondary}>
                          {s === 'male' ? 'Male' : 'Female'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Text variant="overline" color={colors.textSecondary}>
                      Age
                    </Text>
                    <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" style={styles.input} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="overline" color={colors.textSecondary}>
                      Weight (kg)
                    </Text>
                    <TextInput value={weight} onChangeText={setWeight} keyboardType="number-pad" style={styles.input} />
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {step === 3 && (
            <Animated.View entering={FadeInRight.springify().damping(16)} style={styles.stepWrap}>
              <Text variant="h1">Your skin type</Text>
              <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
                Sets your safe sun window. Darker skin needs longer for the same vitamin D.
              </Text>
              <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
                {([1, 2, 3, 4, 5, 6] as Fitzpatrick[]).map((ft) => (
                  <Pressable
                    key={ft}
                    onPress={() => setSkin(ft)}
                    style={[styles.skinChoice, skin === ft && styles.choiceActive]}
                  >
                    <View style={[styles.skinSwatch, { backgroundColor: skinSwatch(ft) }]} />
                    <Text variant="body" color={skin === ft ? colors.teal : colors.textPrimary} style={{ flex: 1 }}>
                      {fitzpatrickLabels[ft]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <Pressable onPress={() => setStep((s) => s - 1)} style={styles.backBtn}>
              <Text variant="bodyMedium" color={colors.textSecondary}>
                Back
              </Text>
            </Pressable>
          )}
          <PrimaryButton
            label={step === TOTAL_STEPS - 1 ? 'Start' : 'Continue'}
            cta
            onPress={next}
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function clampNum(v: string, min: number, max: number, fallback: number) {
  const n = parseInt(v, 10);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function skinSwatch(ft: Fitzpatrick): string {
  return ['#F5D6C6', '#F0C9A8', '#D9A87E', '#B67F52', '#7C4E32', '#4A2E1E'][ft - 1];
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  dots: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', paddingTop: spacing.lg },
  dot: { width: 28, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.teal },
  content: { padding: spacing.xl, flexGrow: 1 },
  stepWrap: { flex: 1, justifyContent: 'center', paddingVertical: spacing.xxl },
  input: {
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    marginTop: spacing.sm,
  },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  choiceActive: { borderColor: colors.teal, backgroundColor: colors.tealDim },
  choiceEmoji: { fontSize: 24 },
  segRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  seg: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  twoCol: { flexDirection: 'row', gap: spacing.lg },
  skinChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  skinSwatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.borderStrong },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.xl },
  backBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
});
