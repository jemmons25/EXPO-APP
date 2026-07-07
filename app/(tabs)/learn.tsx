import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Card, EvidenceChip, Text } from '@/components';
import { colors, radius, spacing } from '@/theme';
import { LEARN_TOPICS } from '@/data/learn';
import { NEWS_ITEMS } from '@/data/news';

type Segment = 'learn' | 'news';

export default function LearnScreen() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('learn');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="h1">Learn</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
            The science, graded honestly — with both sides on the contested stuff.
          </Text>

          <View style={styles.segment}>
            <SegmentBtn label="Explainers" active={segment === 'learn'} onPress={() => setSegment('learn')} />
            <SegmentBtn label="News · Hype Check" active={segment === 'news'} onPress={() => setSegment('news')} />
          </View>

          {segment === 'learn' &&
            LEARN_TOPICS.map((t, i) => (
              <Animated.View key={t.slug} entering={FadeInDown.delay(i * 50).springify().damping(16)}>
                <Pressable onPress={() => router.push(`/learn/${t.slug}`)}>
                  <Card style={styles.topicCard}>
                    <Text style={styles.emoji}>{t.emoji}</Text>
                    <View style={{ flex: 1, gap: 6 }}>
                      <Text variant="h3">{t.title}</Text>
                      <Text variant="caption" color={colors.textSecondary} numberOfLines={2}>
                        {t.summary}
                      </Text>
                      <EvidenceChip strength={t.evidence} compact />
                    </View>
                    <Text variant="h3" color={colors.textTertiary}>
                      ›
                    </Text>
                  </Card>
                </Pressable>
              </Animated.View>
            ))}

          {segment === 'news' &&
            NEWS_ITEMS.map((n, i) => (
              <Animated.View key={n.id} entering={FadeInDown.delay(i * 50).springify().damping(16)}>
                <Card style={{ gap: spacing.sm }}>
                  <View style={styles.rowBetween}>
                    <View style={styles.topicTag}>
                      <Text variant="overline" color={colors.teal}>
                        {n.topic}
                      </Text>
                    </View>
                    <Text variant="caption" color={colors.textTertiary}>
                      {n.date}
                    </Text>
                  </View>
                  <Text variant="h3">{n.headline}</Text>
                  <View style={styles.hypeSection}>
                    <Text variant="overline" color={colors.textSecondary}>
                      What the study actually showed
                    </Text>
                    <Text variant="body" color={colors.textSecondary}>
                      {n.whatItShowed}
                    </Text>
                  </View>
                  <View style={styles.bottomLine}>
                    <Text variant="bodySemibold">Bottom line: </Text>
                    <Text variant="body" color={colors.textSecondary} style={{ flex: 1 }}>
                      {n.bottomLine}
                    </Text>
                  </View>
                  <EvidenceChip strength={n.evidence} />
                </Card>
              </Animated.View>
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SegmentBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segBtn, active && styles.segBtnActive]}>
      <Text variant="bodyMedium" color={active ? colors.textOnAccent : colors.textSecondary}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120, gap: spacing.md },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.pill,
    padding: 4,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.pill },
  segBtnActive: { backgroundColor: colors.teal },
  topicCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  emoji: { fontSize: 32 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topicTag: { backgroundColor: colors.tealDim, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 3 },
  hypeSection: { gap: 4, backgroundColor: colors.bg, padding: spacing.md, borderRadius: radius.md },
  bottomLine: { flexDirection: 'row', flexWrap: 'wrap' },
});
