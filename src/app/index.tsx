import { LoadingScreen } from "@/components/LoadingScreen";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import CreateUserBackend from "./actions/userAuth";

export default function AppRoot() {
  const { user } = useUser();
  const userId = user?.id ?? ''
  const { isLoaded, isSignedIn } = useAuth();
  const { registerForPushNotificationsAsync } = useNotifications();
  const [isInitializing, setIsInitializing] = useState(true);

  const initializeApp = async () => {
    try {
      await registerForPushNotificationsAsync();
      await CreateUserBackend({ userId });
    } catch (error) {
      console.error('Erro na inicialização:', error);
    } finally {
      setIsInitializing(false);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
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