import { useTheme } from "@/hooks/useTheme"
import { supabase } from "@/utils/supabase"
import { useSignUp } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const { theme, colors } = useTheme()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [loader, setLoader] = useState(false)
  const router = useRouter()

  const handleSendVerification = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        phoneNumber,
      })

      await signUp.preparePhoneNumberVerification()
      setPendingVerification(true)
      Alert.alert("Sucesso", "Código de verificação enviado para o seu telefone.")
    } catch (err: any) {
      Alert.alert("Erro", err.errors[0].message)
      console.log(err)
    }
  }

  const handleVerifyCode = async () => {
    if (!isLoaded) return;
    setLoader(true)

    try {
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code: verificationCode,
      });

      if (completeSignUp.status !== "complete") {
        Alert.alert("Erro", "Falha na verificação. Tente novamente.");
        return;
      }

      await setActive({ session: completeSignUp.createdSessionId });

      const clerkId = completeSignUp.createdUserId;

      // Salvar no Supabase
      const { error } = await supabase.from("users").insert([
        {
          clerk_id: clerkId,
          phone: phoneNumber,
        },
      ]);

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        Alert.alert("Erro", "Não foi possível salvar os dados do usuário.");
        return;
      }

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.push("/(profile)/update-profile");
    } catch (err: any) {
      Alert.alert("Erro", err.errors[0].message);
      console.log(err);
    } finally {
      setLoader(false)
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {pendingVerification ? "Digite o código de verificação" : "Crie sua conta"}
        </Text>
        <View style={styles.inputs}>
          {!pendingVerification ? (
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
          style={[styles.button, { backgroundColor: colors.primary, opacity: loader ? 0.7 : 1 }]}
          onPress={pendingVerification ? handleVerifyCode : handleSendVerification}
          disabled={loader}
        >
          {loader ? (
            <ActivityIndicator color={colors.buttonText} size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {pendingVerification ? "Verificar" : "Criar conta"}
            </Text>
          )}
        </TouchableOpacity>
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
})

