import { useNotifications } from "@/hooks/useNotifications";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNetInfo } from '@react-native-community/netinfo';
import { Redirect, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import CreateUserBackend from "./actions/userAuth";

SplashScreen.preventAutoHideAsync();

export default function AppRoot() {
  const { user } = useUser();
  const userId = user?.id || "";
  const { isLoaded, isSignedIn } = useAuth();
  const [isReady, setIsReady] = useState(true);
  const { registerForPushNotificationsAsync } = useNotifications();
  const netInfo = useNetInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await registerForPushNotificationsAsync();
        CreateUserBackend({ userId });
      } finally {
        SplashScreen.hideAsync();
        setIsReady(false);
      }
    }
    fetchData();
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (netInfo.isConnected === false) {
      router.push("/(pages)/NetNoConnection");
      ToastAndroid.show('Sem conexção a internet!', ToastAndroid.SHORT);
    }
  }, [netInfo.isConnected, router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#1E1E1E' }}>
        <ActivityIndicator size={28} color="#1E90FF" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(drawer)/(tabs)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}