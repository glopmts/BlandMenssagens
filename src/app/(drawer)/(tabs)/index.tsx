import { useUser } from "@clerk/clerk-expo"
import { useEffect } from "react"
import { ActivityIndicator, Alert, AppState, TouchableOpacity, View } from "react-native"

import { requestNotificationPermission, useRegisterPushToken } from "@/components/GetTokensNotifications"
import ContactsScreen from "@/components/conatcts/ListContacts"
import MenssagensList from "@/components/messages/ListMenssagens"
import { useTheme } from "@/hooks/useTheme"
import { updateUserOnlineStatus } from "@/utils/userStatus"

import RenderStoriesUsers from "@/components/storys/Render-Stories"
import { FontAwesome } from "@expo/vector-icons"
import { router } from "expo-router"
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

  const handleStories = () => {
    router.navigate("/(pages)/newsStories/AddStories")
  }

  if (!isLoaded) {
    return (
      <View style={[stylesHome.containerLoader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={30} color="#2563eb" />
      </View>
    )
  }

  return (
    <View style={[stylesHome.container, { backgroundColor: colors.background }]}>
      <RenderStoriesUsers />
      <MenssagensList />
      <ContactsScreen />
      <View style={stylesHome.containerButtonStories}>
        <TouchableOpacity style={stylesHome.buttonStories} onPress={handleStories}>
          <FontAwesome name="camera" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
