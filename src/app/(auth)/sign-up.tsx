import PasswordInput from "@/components/PasswordInput";
import { useTheme } from "@/hooks/useTheme";
import { url } from "@/utils/url-api";
import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Animated, Text, TextInput, TouchableOpacity, View } from "react-native";
import { stylesInputs } from "../styles/StylesInputs";

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
  const [isPreview, setIsPreview] = useState(false);

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

  const handleShowPreview = () => setIsPreview(!isPreview);

  return (
    <LinearGradient colors={["#4d4949", "#2f2f2f", "#323131"]} style={stylesInputs.container}>
      <Animated.View style={stylesInputs.formContainer}>
        <Text style={[stylesInputs.title, { color: colors.text }]}>Crie sua conta</Text>
        <View style={stylesInputs.inputs}>
          {!pendingVerification ? (
            <>
              <TextInput
                style={[stylesInputs.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <PasswordInput loader={loader} password={password} setPassword={setPassword} />
              <TextInput
                style={[stylesInputs.input, { color: colors.text }]}
                placeholder="Numero de telefone"
                placeholderTextColor={colors.gray}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
              />
              <TouchableOpacity style={[stylesInputs.button, { backgroundColor: colors.primary }]} onPress={handleSignUp} disabled={loader}>
                {loader ? <ActivityIndicator color={colors.buttonText} /> : <Text style={stylesInputs.buttonText}>Criar conta</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={[stylesInputs.input, { color: colors.text }]}
                placeholder="Código de verificação"
                placeholderTextColor={colors.gray}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={[stylesInputs.button, { backgroundColor: colors.primary }]} onPress={handleVerifyEmail} disabled={loader}>
                {loader ? <ActivityIndicator color={colors.buttonText} /> : <Text style={stylesInputs.buttonText}>Verificar Email</Text>}
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
