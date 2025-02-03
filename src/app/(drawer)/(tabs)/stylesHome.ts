import { Platform, StyleSheet } from "react-native"

export const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    gap: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 1,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
})
