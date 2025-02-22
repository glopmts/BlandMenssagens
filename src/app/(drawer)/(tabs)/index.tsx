import { useUser } from "@clerk/clerk-expo"
import { useEffect } from "react"
import { ActivityIndicator, Alert, AppState, View } from "react-native"

import { requestNotificationPermission, useRegisterPushToken } from "@/components/GetTokensNotifications"
import ContactsScreen from "@/components/conatcts/ListContacts"
import MenssagensList from "@/components/messages/ListMenssagens"
import { useTheme } from "@/hooks/useTheme"
import { updateUserOnlineStatus } from "@/utils/userStatus"

import { stylesHome } from "../../styles/stylesHome"

export default function TabOneScreen() {
  const { colors } = useTheme()
  const { isLoaded, user } = useUser()
  const userId = user?.id || ''
  useRegisterPushToken(userId)

  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await requestNotificationPermission()
      if (!hasPermission) {
        Alert.alert("Attention", "Please enable notifications in device settings.")
      }
    }
    checkPermissions()
  }, [])

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        updateUserOnlineStatus(user?.id, false)
      } else if (nextAppState === "active") {
        updateUserOnlineStatus(user?.id, true)
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return () => subscription.remove()
  }, [user])


  useEffect(() => {
    updateUserOnlineStatus(user?.id, true);
    const interval = setInterval(() => updateUserOnlineStatus(user?.id, true), 3000);
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        updateUserOnlineStatus(user?.id, false);
      }
    };
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      clearInterval(interval);
      subscription.remove();
      updateUserOnlineStatus(user?.id, false);
    };
  }, [user]);

  if (!isLoaded) {
    return (
      <View style={[stylesHome.containerLoader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={30} color="#2563eb" />
      </View>
    )
  }

  return (
    <View style={[stylesHome.container, { backgroundColor: colors.background }]}>
      <MenssagensList />
      <ContactsScreen />
    </View>
  )
}
