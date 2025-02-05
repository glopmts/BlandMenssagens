import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import CreateUserBackend from "./actions/userAuth";

SplashScreen.preventAutoHideAsync();

export default function AppRoot() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(true);
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await registerForPushNotificationsAsync();
        CreateUserBackend();
      } finally {
        SplashScreen.hideAsync();
        setIsReady(false);
      }
    }
    fetchData();
  }, [isLoaded, isSignedIn]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={28} color="#1E90FF" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}