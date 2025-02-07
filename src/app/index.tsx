import { useNotifications } from "@/hooks/useNotifications";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import CreateUserBackend from "./actions/userAuth";

SplashScreen.preventAutoHideAsync();

export default function AppRoot() {
  const { user } = useUser();
  const userId = user?.id || "";
  const { isLoaded, isSignedIn } = useAuth();
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await registerForPushNotificationsAsync();
        CreateUserBackend({ userId });
      } finally {
        SplashScreen.hideAsync();
      }
    }
    fetchData();
  }, [isLoaded, isSignedIn]);


  if (isSignedIn) {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}