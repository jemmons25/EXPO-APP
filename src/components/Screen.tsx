import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  /** Extra bottom padding to clear the floating tab bar. */
  tabBarPad?: boolean;
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = ['top'],
  contentStyle,
  tabBarPad = true,
}: ScreenProps) {
  const inner: ViewStyle = {
    padding: padded ? spacing.xl : 0,
    paddingBottom: (padded ? spacing.xl : 0) + (tabBarPad ? 110 : 0),
  };

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[inner, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
});
