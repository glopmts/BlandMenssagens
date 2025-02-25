import { useTheme } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function LayoutStories() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.backgroundColorHeader },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: "800" },
      headerShown: true,
    }}>

      <Stack.Screen name="AddStories" options={{
        headerTitle: () => (
          <View style={{ marginLeft: 1 }}>
            <Text style={{ fontWeight: "800", fontSize: 18, color: colors.text }}>Adicionar Stories</Text>
          </View>
        ),
      }} />
      <Stack.Screen name="CreateStoryScreen" options={{
        headerTitle: () => (
          <View style={{ marginLeft: 1 }}>
            <Text style={{ fontWeight: "800", fontSize: 18, color: colors.text }}>Finalizar Stories</Text>
          </View>
        ),
      }} />
    </Stack>
  )
}