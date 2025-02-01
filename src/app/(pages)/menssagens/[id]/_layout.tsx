import { useTheme } from "@/hooks/useTheme"
import { Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function MensagensLayout() {
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [name, setName] = useState<string>("")

  useEffect(() => {
    if (id) {
    }
  }, [id])

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
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>{id || "Mensagens"}</Text>
            </View>
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
  searchIcon: {
    marginRight: 15,
  },
})

