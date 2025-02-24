import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from "expo-notifications";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { tokenCache } from '@/utils/cache';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    console.log('Notificação recebida no primeiro plano:', notification);
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});


function RootLayoutNav() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar />
      <GestureHandlerRootView style={[styles.flex, { backgroundColor: colors.background }]}>
        <PortalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'simple_push',
              presentation: 'fullScreenModal',
            }}
          >
          </Stack>
        </PortalProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <ClerkLoaded>
              <RootLayoutNav />
            </ClerkLoaded>
          </ClerkProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});