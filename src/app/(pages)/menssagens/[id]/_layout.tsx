import { useTheme } from "@/hooks/useTheme"
import { url } from "@/utils/url-api"
import { useUser } from "@clerk/clerk-expo"
import { format, } from "date-fns"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Image } from "expo-image"
import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MensagensLayout() {
  const { user } = useUser()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const userId = user?.id;
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [image, setImage] = useState<string | null>(null)
  const [lastOnline, setLastOnline] = useState<string>("")
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const res = await fetch(`${url}/api/user/contactInfor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            contactId: id,
          }),
        })
        if (!res.ok) {
          throw new Error(`Error fetching user data: ${res.status}`)
        }
        const userData = await res.json()
        setName(userData.name)
        setPhone(userData.phone)
        setImage(userData.image)
        setIsOnline(userData.user.isOnline)
        setLastOnline(userData.user.lastOnline)
      }
    }
    fetchData()
  }, [userId])

  const formatLastOnline = (lastOnlineDate?: string) => {
    if (!lastOnlineDate) return "Data indisponível"

    const date = new Date(lastOnlineDate)

    if (isNaN(date.getTime())) {
      console.warn("Data inválida recebida:", lastOnlineDate)
      return "Data inválida"
    }

    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, })
    } else {
      return format(date, "'Visto em' dd 'de' MMMM 'às' HH:mm",)
    }
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundColorHeader,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "800",
        },
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <TouchableOpacity>
              <View style={styles.containerInfor}>
                {image ? (
                  <Image
                    style={{ width: 40, height: 40, borderRadius: 30 }}
                    source={{ uri: image }}
                  />
                ) : (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 30,
                      backgroundColor: colors.primary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                      {name?.charAt(0).toUpperCase() || "MG"}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>{name || phone}</Text>
                  <Text style={[styles.onlineStatus, { color: isOnline ? colors.primary : colors.gray }]}>
                    {isOnline ? "Online" : formatLastOnline(lastOnline)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  onlineStatus: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  containerInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  }
})

