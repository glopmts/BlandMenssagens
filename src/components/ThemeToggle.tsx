import { useTheme } from "@/hooks/useTheme"
import type React from "react"
import { StyleSheet, Switch, Text, View } from "react-native"

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.text }]}>{theme === "light" ? "Light Mode" : "Dark Mode"}</Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        trackColor={{ false: "#767577", true: colors.primary }}
        thumbColor={theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
      />
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
  text: {
    fontSize: 16,
    marginRight: 8,
  },
})

