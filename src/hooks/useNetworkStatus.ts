import { useNetInfo } from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useNetworkStatus() {
  const netInfo = useNetInfo();
  const router = useRouter();

  useEffect(() => {
    if (netInfo.isConnected === false) {
      router.push("/(pages)/NetNoConnection");
    }
  }, [netInfo.isConnected, router]);

  return netInfo.isConnected;
}
