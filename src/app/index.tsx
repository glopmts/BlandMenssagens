import { useNotifications } from "@/hooks/useNotifications";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import CreateUserBackend from "./actions/userAuth";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function AppRoot() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const { registerForPushNotificationsAsync } = useNotifications();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!isLoaded) return;

        if (isSignedIn && user?.id) {
          await registerForPushNotificationsAsync();
          await CreateUserBackend({ userId: user.id });
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setIsInitializing(false);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded || isInitializing) {
    return <LoadingScreen />;
  }

  if (isSignedIn) {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}