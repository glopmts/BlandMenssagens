import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/utils/supabase"
import { format, } from "date-fns"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Image } from "expo-image"
import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MensagensLayout() {
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [name, setName] = useState<string>("")
  const [image, setImage] = useState<string | null>(null)
  const [lastOnline, setLastOnline] = useState<string>("")
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, isOnline, lastOnline, imageurl")
          .eq("clerk_id", id)
          .single()

        if (userError) {
          console.error("Error fetching user:", userError.message)
          return
        }

        setName(userData.name)
        setImage(userData.imageurl)
        setIsOnline(userData.isOnline)
        setLastOnline(userData.lastOnline)
      }
    }
    fetchData()
  }, [id])

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
                      {name?.charAt(0).toUpperCase() || ""}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={[styles.headerTitle, { color: colors.text }]}>{name || "Mensagens"}</Text>
                  <Text style={[styles.onlineStatus, { color: isOnline ? colors.green : colors.gray }]}>
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

