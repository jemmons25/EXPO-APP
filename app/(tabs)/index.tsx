import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  ActivityRings,
  Aurora,
  Card,
  PrimaryButton,
  RingSpec,
  SunArc,
  Text,
} from '@/components';
import { colors, spacing, radius } from '@/theme';
import { useProfile } from '@/lib/profileContext';
import { fetchUvIndex } from '@/lib/uv';
import { solarElevation, sunAdvice, sunTimes, SunAdvice } from '@/lib/solar';
import { proteinTarget } from '@/lib/nutrition';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, dailyLog } = useProfile();
  const [uv, setUv] = useState<number | null>(null);
  const [advice, setAdvice] = useState<SunAdvice | null>(null);
  const [dayProgress, setDayProgress] = useState(0.5);
  const [uvbFrac, setUvbFrac] = useState<{ start: number; end: number }>({ start: 0.35, end: 0.65 });
  const [inWindow, setInWindow] = useState(false);
  const [locName, setLocName] = useState<string>('your location');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const protein = proteinTarget(profile.weightKg, profile.age, profile.goals, profile.sex);

  const loadSun = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let lat = 37.77;
      let lon = -122.42; // sensible default (SF) if permission denied
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        try {
          const geo = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          if (geo[0]?.city) setLocName(geo[0].city);
        } catch {
          /* ignore */
        }
      }

      const now = new Date();
      const elevation = solarElevation(lat, lon, now);
      const uvi = await fetchUvIndex(lat, lon);
      const uviVal = uvi?.uvi ?? estimateUv(elevation);
      setUv(uviVal);
      setAdvice(sunAdvice(uviVal, profile.skinType, elevation));

      const times = sunTimes(lat, lon, now);
      if (times.sunrise && times.sunset) {
        const total = times.sunset.getTime() - times.sunrise.getTime();
        const elapsed = now.getTime() - times.sunrise.getTime();
        setDayProgress(Math.max(0, Math.min(1, elapsed / total)));
        if (times.uvbWindowStart && times.uvbWindowEnd) {
          setUvbFrac({
            start: Math.max(0, (times.uvbWindowStart.getTime() - times.sunrise.getTime()) / total),
            end: Math.min(1, (times.uvbWindowEnd.getTime() - times.sunrise.getTime()) / total),
          });
          setInWindow(now >= times.uvbWindowStart && now <= times.uvbWindowEnd);
        }
      }
    } catch {
      setAdvice(sunAdvice(0, profile.skinType, 0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.skinType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSun();
    setRefreshing(false);
  };

  const sunGoal = advice?.recommendedMinutes || 15;
  const rings: RingSpec[] = [
    { progress: dailyLog.sunMinutes / sunGoal, color: colors.amberStart, trackColor: colors.amberDim },
    { progress: dailyLog.proteinGrams / protein.dailyGrams, color: colors.teal, trackColor: colors.tealDim },
    { progress: dailyLog.cleanItems / 5, color: colors.mint, trackColor: colors.mintDim },
  ];

  return (
    <View style={styles.root}>
      <Aurora hour={hour} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.amberStart} />}
        >
          <Animated.View entering={FadeInDown.springify().damping(16)}>
            <Text variant="overline" color={colors.textSecondary}>
              {greeting(hour)} · {locName}
            </Text>
            <Text variant="h1" style={{ marginTop: 4 }}>
              {profile.name ? `Hey, ${profile.name}` : 'Your day, optimized'}
            </Text>
          </Animated.View>

          {/* Rings */}
          <Animated.View entering={FadeInDown.delay(80).springify().damping(16)}>
            <Card style={styles.ringsCard}>
              <ActivityRings rings={rings} size={148} strokeWidth={13} />
              <View style={styles.ringLegend}>
                <Legend color={colors.amberStart} label="Sun" value={`${dailyLog.sunMinutes}/${sunGoal} min`} />
                <Legend
                  color={colors.teal}
                  label="Protein"
                  value={`${dailyLog.proteinGrams}/${protein.dailyGrams} g`}
                />
                <Legend color={colors.mint} label="Clean eating" value={`${dailyLog.cleanItems}/5 items`} />
              </View>
            </Card>
          </Animated.View>

          {/* Sun window */}
          <Animated.View entering={FadeInDown.delay(160).springify().damping(16)}>
            <Card>
              <View style={styles.rowBetween}>
                <Text variant="h3">Today&apos;s sun window</Text>
                {uv !== null && (
                  <View style={styles.uvBadge}>
                    <Text variant="overline" color={colors.amberStart}>
                      UV {uv.toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.arcWrap}>
                <SunArc
                  dayProgress={dayProgress}
                  uvbStart={uvbFrac.start}
                  uvbEnd={uvbFrac.end}
                  inWindow={inWindow}
                  width={300}
                />
              </View>
              <Text variant="body" color={colors.textSecondary}>
                {loading ? 'Calculating your vitamin-D window…' : advice?.reason}
              </Text>
              {advice?.canSynthesize && (
                <View style={styles.sunStat}>
                  <Text variant="display" color={colors.amberStart}>
                    {advice.recommendedMinutes}
                    <Text variant="h3" color={colors.textSecondary}>
                      {' '}
                      min
                    </Text>
                  </Text>
                  <Text variant="caption" color={colors.textTertiary}>
                    recommended today · don&apos;t burn past {advice.burnCeilingMinutes} min
                  </Text>
                </View>
              )}
            </Card>
          </Animated.View>

          {/* Quick scan CTA */}
          <Animated.View entering={FadeInDown.delay(240).springify().damping(16)}>
            <Card style={styles.scanCard}>
              <View style={{ flex: 1 }}>
                <Text variant="h3">Scan a food</Text>
                <Text variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                  See what&apos;s really in it — graded honestly.
                </Text>
              </View>
              <PrimaryButton label="Scan" cta onPress={() => router.push('/scan')} style={{ minWidth: 120 }} />
            </Card>
          </Animated.View>

          {/* Protein tip */}
          <Animated.View entering={FadeInDown.delay(320).springify().damping(16)}>
            <Card>
              <Text variant="overline" color={colors.teal}>
                Protein target
              </Text>
              <Text variant="h3" style={{ marginTop: 6 }}>
                {protein.dailyGrams} g/day · {protein.perMealGrams} g per meal
              </Text>
              <Text variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>
                {protein.note}
              </Text>
            </Card>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View>
        <Text variant="caption" color={colors.textSecondary}>
          {label}
        </Text>
        <Text variant="bodySemibold">{value}</Text>
      </View>
    </View>
  );
}

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Rough UV estimate from solar elevation if the API is unavailable. */
function estimateUv(elevation: number): number {
  if (elevation <= 0) return 0;
  return Math.round(Math.max(0, Math.min(11, elevation / 8)));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120, gap: spacing.lg },
  ringsCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  ringLegend: { flex: 1, gap: spacing.md },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  uvBadge: {
    backgroundColor: colors.amberDim,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  arcWrap: { alignItems: 'center', marginVertical: spacing.md },
  sunStat: { marginTop: spacing.md },
  scanCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
