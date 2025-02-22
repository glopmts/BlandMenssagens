import PasswordInput from "@/components/PasswordInput"
import { useTheme } from "@/hooks/useTheme"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoader, setLoader] = useState(false)
  const { signIn, setActive } = useSignIn()
  const { colors } = useTheme()

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.")
      return
    }
    setLoader(true)
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
    } finally {
      setLoader(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            <PasswordInput password={password} setPassword={setPassword} />
          </View>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onLogin}>
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {isLoader ? (
                <ActivityIndicator size={28} color={colors.text} />
              ) : (
                "Login"
              )}
            </Text>
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
    </TouchableWithoutFeedback>
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

