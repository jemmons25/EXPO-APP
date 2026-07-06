import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Card, IngredientRow, PrimaryButton, ScoreRing, Text } from '@/components';
import { colors, radius, scoreBand, scoreColor, spacing } from '@/theme';
import { fetchProduct, ScannedProduct, scoreIngredientText } from '@/lib/openFoodFacts';
import { addToHistory } from '@/lib/storage';
import { useProfile } from '@/lib/profileContext';

type Mode = 'idle' | 'camera' | 'loading' | 'result';

// A recognizable sample (Nutella) for reviewers/devices without a barcode to scan.
const SAMPLE_BARCODE = '3017620422003';

export default function ScanScreen() {
  const router = useRouter();
  const { addCleanItem } = useProfile();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<Mode>('idle');
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [manual, setManual] = useState('');
  const scanning = useRef(false);

  const resolveBarcode = async (barcode: string) => {
    setMode('loading');
    const result = await fetchProduct(barcode);
    setProduct(result);
    setMode('result');
    if (result.found) {
      await addToHistory(result);
      if (result.score >= 60) addCleanItem();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const onBarcode = (res: BarcodeScanningResult) => {
    if (scanning.current) return;
    scanning.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resolveBarcode(res.data);
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const r = await requestPermission();
      if (!r.granted) return;
    }
    scanning.current = false;
    setMode('camera');
  };

  const reset = () => {
    scanning.current = false;
    setProduct(null);
    setMode('idle');
  };

  if (mode === 'camera') {
    return <CameraScanner onBarcode={onBarcode} onClose={reset} />;
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="h1">Scan</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Barcode or ingredient label — we grade it honestly, with the evidence.
          </Text>

          {mode === 'idle' && (
            <Animated.View entering={FadeInDown.springify().damping(16)} style={{ gap: spacing.lg, marginTop: spacing.xl }}>
              <Card style={styles.hero}>
                <View style={styles.scanIconWrap}>
                  <Text style={styles.scanIcon}>⊡</Text>
                </View>
                <Text variant="h3" center>
                  Point at a barcode
                </Text>
                <Text variant="body" color={colors.textSecondary} center>
                  We pull the product from Open Food Facts, flag every ingredient, and show a transparent clean score.
                </Text>
                <PrimaryButton label="Open scanner" cta onPress={openCamera} style={{ alignSelf: 'stretch' }} />
              </Card>

              <Card>
                <Text variant="overline" color={colors.textSecondary}>
                  No barcode handy?
                </Text>
                <View style={styles.manualRow}>
                  <TextInput
                    value={manual}
                    onChangeText={setManual}
                    placeholder="Enter a barcode number"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  <PrimaryButton
                    label="Go"
                    variant="outline"
                    onPress={() => manual.trim() && resolveBarcode(manual.trim())}
                    style={{ minWidth: 80 }}
                  />
                </View>
                <Pressable onPress={() => resolveBarcode(SAMPLE_BARCODE)} style={styles.sampleLink}>
                  <Text variant="caption" color={colors.teal}>
                    Try a sample product →
                  </Text>
                </Pressable>
              </Card>
            </Animated.View>
          )}

          {mode === 'loading' && (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.teal} size="large" />
              <Text variant="body" color={colors.textSecondary}>
                Looking it up…
              </Text>
            </View>
          )}

          {mode === 'result' && product && <ResultView product={product} onScanAgain={reset} onFind={() => router.push('/find')} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function CameraScanner({ onBarcode, onClose }: { onBarcode: (r: BarcodeScanningResult) => void; onClose: () => void }) {
  const sweep = useSharedValue(0);
  useEffect(() => {
    sweep.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [sweep]);

  const laserStyle = useAnimatedStyle(() => ({
    top: `${interpolate(sweep.value, [0, 1], [12, 78])}%`,
    opacity: interpolate(sweep.value, [0, 0.5, 1], [0.4, 1, 0.4]),
  }));

  return (
    <View style={styles.cameraRoot}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={onBarcode}
      />
      <SafeAreaView style={styles.cameraOverlay} edges={['top']}>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text variant="bodySemibold" color={colors.white}>
            ✕ Close
          </Text>
        </Pressable>
        <View style={styles.reticleWrap} pointerEvents="none">
          <View style={styles.reticle}>
            <Animated.View style={[styles.laser, laserStyle]} />
          </View>
          <Text variant="caption" color={colors.white} style={styles.reticleHint}>
            Center the barcode
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ResultView({
  product,
  onScanAgain,
  onFind,
}: {
  product: ScannedProduct;
  onScanAgain: () => void;
  onFind: () => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!product.found) {
    return (
      <Animated.View entering={FadeIn} style={{ marginTop: spacing.xxl, gap: spacing.lg }}>
        <Card>
          <Text variant="h3">Product not found</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 6 }}>
            It&apos;s not in the Open Food Facts database yet. Try the ingredient-label scan, or scan another item.
          </Text>
        </Card>
        <PrimaryButton label="Scan again" cta onPress={onScanAgain} />
      </Animated.View>
    );
  }

  const color = scoreColor(product.score);
  const flaggedCount = product.flaggedIngredients.length;

  return (
    <Animated.View entering={FadeInDown.springify().damping(16)} style={{ marginTop: spacing.xl, gap: spacing.lg }}>
      <Card style={{ alignItems: 'center', gap: spacing.md }}>
        <Text variant="overline" color={colors.textSecondary}>
          {product.brand ?? 'Product'}
        </Text>
        <Text variant="h2" center numberOfLines={2}>
          {product.name}
        </Text>
        <ScoreRing score={product.score} />
        <Text variant="body" color={color}>
          {scoreBand(product.score)} · {flaggedCount === 0 ? 'no flagged ingredients' : `${flaggedCount} flagged`}
        </Text>
        {product.novaGroup && (
          <View style={styles.novaBadge}>
            <Text variant="caption" color={colors.textSecondary}>
              NOVA {product.novaGroup} ·{' '}
              {product.novaGroup === 4
                ? 'ultra-processed'
                : product.novaGroup === 3
                  ? 'processed'
                  : 'minimally processed'}
            </Text>
          </View>
        )}
      </Card>

      {/* Why this score */}
      <Card>
        <Pressable onPress={() => setShowBreakdown((s) => !s)} style={styles.rowBetween}>
          <Text variant="h3">Why this score</Text>
          <Text variant="h3" color={colors.textSecondary}>
            {showBreakdown ? '−' : '+'}
          </Text>
        </Pressable>
        {showBreakdown && (
          <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
            {product.scoreComponents.length === 0 && (
              <Text variant="body" color={colors.textSecondary}>
                No penalties — a clean, whole-food profile.
              </Text>
            )}
            {product.scoreComponents.map((c, i) => (
              <View key={i} style={styles.compRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMedium">{c.label}</Text>
                  <Text variant="caption" color={colors.textTertiary}>
                    {c.detail}
                  </Text>
                </View>
                <Text variant="bodySemibold" color={c.delta >= 0 ? colors.mint : colors.coral}>
                  {c.delta >= 0 ? '+' : ''}
                  {c.delta}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Ingredients */}
      {product.allIngredients.length > 0 && (
        <Card>
          <Text variant="h3" style={{ marginBottom: spacing.sm }}>
            Ingredients
          </Text>
          {product.allIngredients.map((item, i) => (
            <IngredientRow key={`${item.raw}-${i}`} item={item} index={i} />
          ))}
        </Card>
      )}

      {/* Flagged callout with honest framing */}
      {flaggedCount > 0 && (
        <Card style={{ backgroundColor: colors.coralDim, borderColor: 'rgba(255,92,92,0.25)' }}>
          <Text variant="bodySemibold">What to know</Text>
          <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Flags are graded by evidence and dose — a trace of a contested additive isn&apos;t the same as a staple.
            Tap any ingredient above for the science and where regulators disagree.
          </Text>
        </Card>
      )}

      <Card>
        <Text variant="h3">Find a cleaner option</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: 4, marginBottom: spacing.md }}>
          Whole-food sources near you often beat any packaged swap.
        </Text>
        <PrimaryButton label="Open Real Food Finder" variant="outline" onPress={onFind} />
      </Card>

      <PrimaryButton label="Scan again" cta onPress={onScanAgain} />
      <Text variant="caption" color={colors.textTertiary} center>
        Data from Open Food Facts (OdBL). Educational, not medical advice.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 120 },
  hero: { alignItems: 'center', gap: spacing.md },
  scanIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.tealDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: { fontSize: 38, color: colors.teal },
  manualRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.sm },
  input: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  sampleLink: { marginTop: spacing.md, alignSelf: 'flex-start' },
  loading: { alignItems: 'center', gap: spacing.lg, marginTop: spacing.huge },
  cameraRoot: { flex: 1, backgroundColor: colors.black },
  cameraOverlay: { flex: 1, justifyContent: 'flex-start' },
  closeBtn: { alignSelf: 'flex-end', margin: spacing.xl, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill },
  reticleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  reticle: {
    width: '78%',
    aspectRatio: 1.4,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: 'rgba(45,212,191,0.6)',
    overflow: 'hidden',
  },
  laser: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.teal,
    shadowColor: colors.teal,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  reticleHint: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  novaBadge: { backgroundColor: colors.bg, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  compRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 4 },
});
