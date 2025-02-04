import { useTheme } from "@/hooks/useTheme"
import { url } from "@/utils/url-api"
import { useSignIn } from "@clerk/clerk-expo"
import { Link, useRouter } from "expo-router"
import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { theme, colors } = useTheme()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const handleSendOTP = async () => {
    if (!isLoaded) return
    try {
      await signIn.create({
        identifier: phoneNumber,
        strategy: "phone_code",
      })
      setOtpSent(true)
      Alert.alert("Sucesso", "Código de verificação enviado para o seu telefone.")
    } catch (err: any) {
      Alert.alert("Erro", err.errors[0].message)
    }
  }

  const handleVerifyOTP = async () => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code: verificationCode,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });

        await fetch(`${url}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: completeSignIn?.id,
            phoneNumber,
          }),
        });

        router.push("/(drawer)/(tabs)");
      } else {
        Alert.alert("Erro", "Falha na verificação. Tente novamente.");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.errors[0]?.message || "Erro desconhecido.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {otpSent ? "Digite o código de verificação" : "Entre com seu número de telefone"}
        </Text>
        <View style={styles.inputs}>
          {!otpSent ? (
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
              placeholder="Número de telefone"
              placeholderTextColor={colors.text}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
          ) : (
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
              placeholder="Código de verificação"
              placeholderTextColor={colors.text}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
            />
          )}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={otpSent ? handleVerifyOTP : handleSendOTP}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {otpSent ? "Verificar" : "Enviar código"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.text, { color: colors.text }]}>
          Não tem uma conta? {" "}
          <Link href="/(auth)/sign-up" style={[styles.link, { color: colors.primary }]}>Cadrasta-se</Link>
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
    fontSize: 20,
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
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  bottomContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  }
})

