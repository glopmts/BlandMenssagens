import { StyleSheet } from "react-native";

export const stylesListMenssagens = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 5,
  },
  messagesItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },
  lastSeen: {
    color: "gray",
    fontSize: 12,
  },
  contaInfo: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  contactInitialText: {
    color: "white",
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 20,
    maxWidth: 200,
  },
  namesDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  imagePlaceholder: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: "center",
    gap: 5
  },
  imagePlaceholderText: {
    color: "#555",
    fontSize: 15,
  },
});