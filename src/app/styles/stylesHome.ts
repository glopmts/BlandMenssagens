import { Platform, StyleSheet } from "react-native"

export const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    gap: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 1,
    position: 'relative',
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  containerButtonStories: {
    position: "absolute",
    top: 0,
    right: 18,
    height: "100%",
    width: 60,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    zIndex: 144,
    padding: 15
  },
  buttonStories: {
    backgroundColor: "#1E90FF",
    borderRadius: 50,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  }
})
