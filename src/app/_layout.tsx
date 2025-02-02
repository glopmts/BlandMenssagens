import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { tokenCache } from '@/utils/cache';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { PortalProvider } from '@gorhom/portal';
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from 'expo-router';
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
      shouldShowAlert: true,  // Aqui você controla a exibição de alerta
      shouldPlaySound: true,  // Se a notificação deve emitir som
      shouldSetBadge: false,  // Se a notificação deve alterar o ícone
    };
  },
});

async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Você precisa permitir notificações para receber alertas!');
  } else {
    console.log('Permissão concedida para notificações');
  }
}


function RootLayoutNav() {
  const { colors } = useTheme();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/sign-in');
      requestNotificationPermissions();
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Resposta da notificação:', response);

      const { data } = response.notification.request.content;
      if (data && data.chatId) {
        router.push(`/(pages)/menssagens/${data.chatId}`);
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [router]);


  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PortalProvider>
      </GestureHandlerRootView>
      <StatusBar translucent={true} />
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