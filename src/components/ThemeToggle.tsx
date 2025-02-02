import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import type React from "react"
import { Pressable, StyleSheet, View } from "react-native"

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleTheme}>
        {theme === 'dark' ? <MaterialIcons name="nightlight" size={24} color={colors.text} /> : <MaterialIcons name="light-mode" size={24} color={colors.text} />}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
})

