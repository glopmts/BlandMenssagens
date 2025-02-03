import { useUser } from "@clerk/clerk-expo"
import * as Contacts from "expo-contacts"
import { useEffect } from "react"
import { ActivityIndicator, Alert, AppState, View } from "react-native"

import { requestNotificationPermission, useRegisterPushToken } from "@/components/GetTokensNotifications"
import ContactsScreen from "@/components/ListContacts"
import MenssagensList from "@/components/ListMenssagens"
import { useTheme } from "@/hooks/useTheme"
import { updateUserOnlineStatus } from "@/utils/userStatus"

import { stylesHome } from "./stylesHome"

export default function TabOneScreen() {
  const { colors } = useTheme()
  const { isLoaded, user } = useUser()

  useRegisterPushToken(user?.id!)

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync()
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        })
        if (data.length > 0) {
          console.log("First contact:", data[0])
        }
      }
    }
    getContacts()
  }, [])

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
    updateUserOnlineStatus(user?.id, true)
    const interval = setInterval(() => updateUserOnlineStatus(user?.id, true), 30000)
    return () => clearInterval(interval)
  }, [user])


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
