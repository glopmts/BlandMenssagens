import { DrawerContent } from '@/components/DrawerContent';
import { useTheme } from '@/hooks/useTheme';
import { Drawer } from 'expo-router/drawer';

export default function DrawerServices() {
  const { colors } = useTheme();
  return (
    <Drawer
      screenOptions={{
        drawerStyle: { width: 330, backgroundColor: colors.background },
        swipeEnabled: false,
        headerShown: false,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="(tabs)"
      />

    </Drawer>
  )
}