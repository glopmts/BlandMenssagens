import { useTheme } from "@/hooks/useTheme";
import { useAuth, useClerk, useSignIn, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddCount() {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loader, setLoader] = useState(false);
  const { setActive } = useClerk();
  const { session } = useClerk();

  const handleVerifyOTP = async () => {
    if (!isLoaded) return;
    setLoader(true);

    try {
      if (session) {
        await signOut();
      }

      const completeSignIn = await signIn?.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === "complete") {
        setTimeout(async () => {
          await setActive({ session: completeSignIn.createdSessionId });

          await saveAccount(completeSignIn?.createdSessionId ?? "", {
            id: completeSignIn?.id,
            email,
            userId: user?.id
          });

          Alert.alert("Sucesso", "Conta adicionada com sucesso!", [
            {
              text: "Adicionar outra conta",
              onPress: () => {
                setEmail("");
                setPassword("");
                setVerificationCode("");
                setOtpSent(false);
              },
            },
            {
              text: "Ir para a Home",
              onPress: () => {
                router.push("/(drawer)/(tabs)");
              },
            },
          ]);
        }, 500);
      } else {
        Alert.alert("Erro", "Falha na verificação. Tente novamente.");
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert("Erro", err.errors[0]?.message || "Erro desconhecido.");
    } finally {
      setLoader(false);
    }
  };


  const saveAccount = async (sessionId: string, user: any) => {
    try {
      const storedAccounts = await AsyncStorage.getItem("logged_accounts");
      const parsedAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];

      if (!Array.isArray(parsedAccounts)) {
        await AsyncStorage.setItem("logged_accounts", JSON.stringify([]));
        return;
      }

      const exists = parsedAccounts.some((acc: any) => acc.sessionId === sessionId);
      if (!exists) {
        const updatedAccounts = [...parsedAccounts, { sessionId, user }];
        await AsyncStorage.setItem("logged_accounts", JSON.stringify(updatedAccounts));
      }
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {otpSent ? "Digite o código de verificação" : "Entre com seu email"}
        </Text>
        <View style={styles.inputs}>
          {!otpSent ? (
            <View>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
                placeholder="Email"
                placeholderTextColor={colors.text}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                textContentType="emailAddress"
              />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.borderColor }]}
                placeholder="Senha ( 8 digitos)"
                placeholderTextColor={colors.text}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
              />
            </View>
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
          onPress={handleVerifyOTP}
          disabled={loader}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {loader ? (
              <ActivityIndicator size={28} color={colors.buttonText} />
            ) : (
              ' Login'
            )}
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
  );
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
  },
});