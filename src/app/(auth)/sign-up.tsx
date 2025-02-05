import { useTheme } from "@/hooks/useTheme";
import { url } from "@/utils/url-api";
import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { theme, colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setLoader(true);
    try {
      if (password.length < 8) {
        Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres.");
        setLoader(false);
        return;
      }
      if (!email.includes("@") || !email.includes(".com")) {
        Alert.alert("Erro", "Email inválido.");
        setLoader(false);
        return;
      }
      await signUp.reload();

      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Novo código enviado", "Verifique seu email.");
      setPendingVerification(true);

    } catch (err: any) {
      Alert.alert("Erro", err.errors?.[0]?.message || "Ocorreu um erro ao criar a conta.");
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;
    setLoader(true);

    if (signUp.verifications.emailAddress?.status === "verified") {
      Alert.alert("Erro", "Este email já foi verificado.");
      return;
    }

    try {
      const verification = await signUp.attemptEmailAddressVerification({ code });
      if (verification.status === "complete") {
        await setActive({ session: verification.createdSessionId });
        const clerkId = verification.createdUserId;

        const res = await fetch(`${url}/api/user/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: clerkId,
            clerk_id: clerkId,
            email: email,
            phone: phone,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        Alert.alert("Sucesso", "Conta verificada com sucesso!");
        router.push("/(pages)/(profile)/newsUserUpadete");
      } else {
        Alert.alert("Erro", "Código inválido ou expirado. Tente novamente ou solicite um novo código.");
      }
    } catch (err: any) {
      Alert.alert("Erro", err.errors?.[0]?.message || "Ocorreu um erro ao verificar o email.");
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;
    setLoader(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Sucesso", "Novo código enviado. Verifique seu email.");
    } catch (err: any) {
      Alert.alert("Erro", err.errors?.[0]?.message || "Ocorreu um erro ao reenviar o código.");
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <LinearGradient colors={["#4d4949", "#2f2f2f", "#323131"]} style={styles.container}>
      <Animated.View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Crie sua conta</Text>
        <View style={styles.inputs}>
          {!pendingVerification ? (
            <>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Senha"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Numero de telefone"
                placeholderTextColor={colors.gray}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
              />
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignUp} disabled={loader}>
                {loader ? <ActivityIndicator color={colors.buttonText} /> : <Text style={styles.buttonText}>Criar conta</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Código de verificação"
                placeholderTextColor={colors.gray}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleVerifyEmail} disabled={loader}>
                {loader ? <ActivityIndicator color={colors.buttonText} /> : <Text style={styles.buttonText}>Verificar Email</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  formContainer: { width: "100%", maxWidth: 400 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputs: { marginBottom: 20 },
  input: { height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16 },
  button: { height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center" },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});