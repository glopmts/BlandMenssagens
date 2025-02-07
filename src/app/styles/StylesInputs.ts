import { StyleSheet } from "react-native";


export const stylesInputs = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  formContainer: { width: "100%", maxWidth: 400 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputs: { marginBottom: 20 },
  input: { height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  button: { height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  passwordInput: {
    position: 'relative'
  },
  buttonPassword: {
    position: 'absolute',
    top: 0,
    right: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
});