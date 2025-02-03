import { Platform, StyleSheet } from "react-native"


export const stylesChat = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: Platform.OS === "ios" ? 60 : 80,
  },
  header: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    position: "relative",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
    textAlign: "right",
  },
  arrow: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderWidth: 8,
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  arrowRight: {
    right: -8,
    borderRightColor: "transparent",
  },
  arrowLeft: {
    left: -8,
    borderLeftColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})