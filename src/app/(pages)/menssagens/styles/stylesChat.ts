import { Dimensions, Platform, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_IMAGE_WIDTH = SCREEN_WIDTH * 0.5;

export const stylesChat = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 10,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 8,
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
    minWidth: 80,
  },
  sentMessage: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextImage: {
    fontSize: 16,
    lineHeight: 22,
    right: 0,
    alignContent: "flex-end",
    zIndex: 1,
  },
  timeText: {
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    padding: 12,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    padding: 4,
  },
  imageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  ImagesChat: {
    marginBottom: 8,
    borderRadius: 12,
    padding: 1,
    overflow: "hidden",
    position: "relative"
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  imageTime: {
    position: "absolute",
    bottom: 5,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 12,
  },

  imageCaption: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },

  image: {
    width: MAX_IMAGE_WIDTH,
    height: MAX_IMAGE_WIDTH * 0.75,
    borderRadius: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  smallImage: {
    width: MAX_IMAGE_WIDTH / 2 - 2,
    height: (MAX_IMAGE_WIDTH / 2 - 2) * 0.75,
    borderRadius: 8,
    margin: 1,
  },
  messageContent: {
    maxWidth: MAX_IMAGE_WIDTH,
  },
  optionsButton: {
    position: "absolute",
    top: 3,
    right: -1,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    padding: 8,
    flexDirection: 'row',
    gap: 20,
    width: "auto"
  },
  deletedMessage: {
    color: "gray",
    fontStyle: "italic",
  }
})
