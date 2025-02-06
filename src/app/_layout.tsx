import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { tokenCache } from '@/utils/cache';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  );
}

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('Notificação recebida no primeiro plano:', notification);
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

function RootLayoutNav() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar translucent={true} />
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <PortalProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerTintColor: colors.text,
              contentStyle: { backgroundColor: colors.background },
              headerShown: false,
            }}
          >
            <Stack.Screen name='index' />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(profile)" />
            <Stack.Screen name="(pages)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PortalProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <RootLayoutNav />
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}
