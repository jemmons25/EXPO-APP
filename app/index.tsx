import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useProfile } from '@/lib/profileContext';
import { colors } from '@/theme';

export default function Index() {
  const { profile, ready } = useProfile();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.teal} />
      </View>
    );
  }

  return <Redirect href={profile.onboarded ? '/(tabs)' : '/onboarding'} />;
}
