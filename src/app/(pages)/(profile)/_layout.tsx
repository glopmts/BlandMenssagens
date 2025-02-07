import UserData from "@/hooks/useData";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LayoutProfile() {
  const { user } = useUser();
  const userId = user?.id || "";
  const { colors } = useTheme();
  const { name, image, isOnline, isLoader } = UserData({ userId })

  if (isLoader) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={28} color={colors.text} />
      </View>
    );
  }
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "800",
          },
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="profile"
          options={{
            headerTitle: () => (
              <View style={styles.headerIcons}>
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
                  <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {name || 'No name'}
                  </Text>
                  <Text style={[styles.headerOnline, { color: isOnline ? colors.primary : colors.gray }]}>
                    {isOnline ? "Online" : "Offline"}
                  </Text>
                </View>
              </View>
            ),
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => router.push('/updateProfile')}>
                  <MaterialCommunityIcons name="pencil" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            ),
          }}
        ></Stack.Screen>
        <Stack.Screen name="updateProfile" options={{ headerTitle: "Atualizar Perfil" }} />
      </Stack>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcons: {
    flex: 1,
    gap: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  headerOnline: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
  }
})