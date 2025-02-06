import { StyleSheet } from "react-native";

export const stylesLayoutId = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  onlineStatus: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  containerInfor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalContainerItens: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    width: "60%",
    minHeight: 100
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 18,
    fontWeight: "800",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonCancele: {
    padding: 10,
    borderRadius: 5,
  },
  textButtons: {
    fontSize: 16,
    fontWeight: "600",
  }
})
