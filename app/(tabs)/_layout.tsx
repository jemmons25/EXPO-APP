import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="find" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
