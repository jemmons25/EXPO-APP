import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors, radius, spacing, spring } from '@/theme';
import { Text } from './Text';

const ICONS: Record<string, string> = {
  index: '◎',
  scan: '⊡',
  find: '◈',
  learn: '❋',
  me: '◐',
};
const LABELS: Record<string, string> = {
  index: 'Home',
  scan: 'Scan',
  find: 'Find',
  learn: 'Learn',
  me: 'Me',
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const count = state.routes.length;
  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, spring.snappy);
  }, [state.index, activeIndex]);

  const tabWidth = 100 / count;
  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${activeIndex.value * tabWidth}%`,
    width: `${tabWidth}%`,
  }));

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom || spacing.md }]} pointerEvents="box-none">
      <BlurView intensity={40} tint="dark" style={styles.bar}>
        <Animated.View style={[styles.indicatorTrack, indicatorStyle]}>
          <View style={styles.indicator} />
        </Animated.View>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TabItem key={route.key} name={route.name} focused={focused} onPress={onPress} />
          );
        })}
      </BlurView>
    </View>
  );
}

function TabItem({ name, focused, onPress }: { name: string; focused: boolean; onPress: () => void }) {
  const scale = useSharedValue(focused ? 1 : 0.9);
  const lift = useDerivedValue(() => withSpring(focused ? 1 : 0, spring.snappy));

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.9, spring.bouncy);
  }, [focused, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value * -3 }],
  }));

  return (
    <Pressable style={styles.item} onPress={onPress} hitSlop={8}>
      <Animated.Text style={[styles.icon, iconStyle, { color: focused ? colors.teal : colors.textTertiary }]}>
        {ICONS[name] ?? '•'}
      </Animated.Text>
      <Text variant="overline" color={focused ? colors.teal : colors.textTertiary} style={styles.label}>
        {LABELS[name] ?? name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: 'rgba(19,26,36,0.7)',
    paddingVertical: spacing.md,
    width: '90%',
  },
  indicatorTrack: { position: 'absolute', top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  indicator: {
    width: 44,
    height: 34,
    borderRadius: radius.lg,
    backgroundColor: colors.tealDim,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.3)',
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 22, lineHeight: 26 },
  label: { fontSize: 10 },
});
