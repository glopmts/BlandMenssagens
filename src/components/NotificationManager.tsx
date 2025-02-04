import { url } from "@/utils/url-api"
import { useRouter } from "expo-router"
import { useCallback, useEffect } from "react"
import { useNotifications } from "../hooks/useNotifications"

export function NotificationManager({ userId }: { userId?: string | null }) {
  const router = useRouter()

  const handleNotificationResponse = (data: any) => {
    if (data?.chatId) {
      router.push(`/(pages)/menssagens/${data.chatId}`)
    }
  }

  const registerForPushNotificationsAsyncCallback = useCallback(handleNotificationResponse, [
    handleNotificationResponse,
  ])

  const { registerForPushNotificationsAsync } = useNotifications(registerForPushNotificationsAsyncCallback)

  useEffect(() => {
    async function setupNotifications() {
      if (userId) {
        const token = await registerForPushNotificationsAsync()
        if (token) {
          try {
            await fetch(`${url}/api/user/pushtoken`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                pushToken: token,
              }),
            })
          } catch (error) {
            console.error("Erro ao salvar token:", error)
          }
        }
      }
    }

    setupNotifications()
  }, [userId, registerForPushNotificationsAsync])

  return null
}

