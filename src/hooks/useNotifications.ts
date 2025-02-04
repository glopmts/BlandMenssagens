import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { useEffect, useRef } from "react"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export function useNotifications(onNotificationResponse?: (data: any) => void) {
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  async function registerForPushNotificationsAsync() {
    let token

    if (!Device.isDevice) {
      console.log("Notificações só funcionam em dispositivos físicos")
      return null
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Permissão para notificações não concedida!")
      return null
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      })
    ).data

    return token
  }

  useEffect(() => {
    const token = registerForPushNotificationsAsync()

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notificação recebida:", notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data
      if (onNotificationResponse) {
        onNotificationResponse(data)
      }
    })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [onNotificationResponse, registerForPushNotificationsAsync])

  return { registerForPushNotificationsAsync }
}

