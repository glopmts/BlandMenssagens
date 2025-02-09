import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
      shouldSetBadge: false,
    };
  },
});

const LoadingScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.text} />
    </View>
  );
};

function RootLayoutNav() {
  const { colors } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar />
      <GestureHandlerRootView style={styles.flex} onLayout={onLayoutRootView}>
        <PortalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              presentation: 'transparentModal',
            }}
          >
            <Stack.Screen name='index' />
            <Stack.Screen name='(drawer)/(tabs)' />
            <Stack.Screen name='(auth)' />
          </Stack>
        </PortalProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isReady = fontsLoaded;

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        
        // Aqui você pode adicionar outras inicializações necessárias
        // Por exemplo, carregar dados iniciais, verificar autenticação, etc.
        
      } catch (e) {
        console.warn(e);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <ClerkLoaded>
            <RootLayoutNav />
          </ClerkLoaded>
        </ClerkProvider>
      </ThemeProvider>
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