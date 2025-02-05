import { useTheme } from "@/hooks/useTheme"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, router } from "expo-router"
import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, setActive } = useSignIn()
  const { colors } = useTheme()

  const onLogin = async () => {
    try {
      const result = await signIn?.create({
        identifier: email,
        password,
      })

      if (result?.status === "complete") {
        if (setActive) {
          await setActive({ session: result.createdSessionId })
          Alert.alert("Login efetuado com sucesso!")
          router.push("/(drawer)/(tabs)")
        }
      } else {
        console.error("Error:", result)
        Alert.alert("Erro", "Falha no login. Por favor, verifique seu email e senha.")
      }
    } catch (err: any) {
      console.error("Error:", err.message)
      Alert.alert("Erro", err.message || "Não foi possível fazer login.")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Entre com seu email</Text>
        <View style={styles.inputs}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
            placeholder="Email"
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
            placeholder="Senha"
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onLogin}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.text, { color: colors.text }]}>
          Não tem uma conta?{" "}
          <Link href="/(auth)/sign-up" style={[styles.link, { color: colors.primary }]}>
            Cadastre-se
          </Link>
        </Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputs: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  bottomContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
})

