import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, EvidenceChip, Text } from '@/components';
import { colors, radius, spacing } from '@/theme';
import { getTopic } from '@/data/learn';

export default function TopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const topic = getTopic(slug);

  if (!topic) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe}>
          <Text variant="h2" style={{ padding: spacing.xl }}>
            Topic not found
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text variant="bodyMedium" color={colors.teal}>
              ‹ Learn
            </Text>
          </Pressable>

          <Text style={styles.emoji}>{topic.emoji}</Text>
          <Text variant="h1">{topic.title}</Text>
          <View style={{ marginTop: spacing.md }}>
            <EvidenceChip strength={topic.evidence} />
          </View>

          {/* 30-second summary */}
          <Card style={{ marginTop: spacing.xl }}>
            <Text variant="overline" color={colors.teal}>
              30-second summary
            </Text>
            <Text variant="bodyLg" style={{ marginTop: spacing.sm }}>
              {topic.summary}
            </Text>
          </Card>

          {/* Both sides */}
          {topic.bothSides && (
            <Card style={{ marginTop: spacing.lg, gap: spacing.md }}>
              <Text variant="overline" color={colors.honey}>
                Both sides
              </Text>
              <View style={styles.sideBox}>
                <Text variant="bodySemibold" color={colors.mint}>
                  Mainstream / weight of evidence
                </Text>
                <Text variant="body" color={colors.textSecondary}>
                  {topic.bothSides.mainstream}
                </Text>
              </View>
              <View style={styles.sideBox}>
                <Text variant="bodySemibold" color={colors.honey}>
                  Dissenting view
                </Text>
                <Text variant="body" color={colors.textSecondary}>
                  {topic.bothSides.dissent}
                </Text>
              </View>
              {topic.bothSides.agreement && (
                <View style={styles.sideBox}>
                  <Text variant="bodySemibold" color={colors.teal}>
                    Where they agree
                  </Text>
                  <Text variant="body" color={colors.textSecondary}>
                    {topic.bothSides.agreement}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Deep dive */}
          <Card style={{ marginTop: spacing.lg }}>
            <Text variant="overline" color={colors.textSecondary}>
              5-minute deep dive
            </Text>
            <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
              {topic.deepDive.map((para, i) => (
                <Animated.View key={i} entering={FadeInDown.delay(i * 40).springify().damping(16)}>
                  <Text variant="bodyLg" color={colors.textSecondary}>
                    {para}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Card>

          {/* Citations */}
          <Card style={{ marginTop: spacing.lg }}>
            <Text variant="overline" color={colors.textSecondary}>
              Sources
            </Text>
            <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
              {topic.citations.map((c, i) => (
                <Pressable key={i} onPress={() => Linking.openURL(c.url)}>
                  <Text variant="bodyMedium" color={colors.teal}>
                    {c.title}
                  </Text>
                  <Text variant="caption" color={colors.textTertiary}>
                    {[c.publisher, c.studyType].filter(Boolean).join(' · ')}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Text variant="caption" color={colors.textTertiary} center style={{ marginTop: spacing.xl }}>
            Educational, not medical advice.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  back: { marginBottom: spacing.lg, alignSelf: 'flex-start' },
  emoji: { fontSize: 44, marginBottom: spacing.sm },
  sideBox: { gap: 4, backgroundColor: colors.bg, padding: spacing.md, borderRadius: radius.md },
});
