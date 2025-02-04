import { useTheme } from "@/hooks/useTheme";
import { url } from "@/utils/url-api";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

interface AddContactsProps {
  number?: string;
}

export default function AddContacts({ number }: AddContactsProps) {
  const { user } = useUser();
  const { colors } = useTheme();

  const numberInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);
  const [isFocusedPhone, setIsFocusedPhone] = useState(false);
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(number);
  const [name, setName] = useState("");
  const isFormValid = phoneNumber?.trim() !== "" && name.trim() !== "";

  const handleAddContact = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${url}/api/user/addContacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          name,
          userId: user?.id,
        }),
      })

      if (!res.ok) {
        Alert.alert("Failed to add contact!")
        throw new Error("Não foi possível adicionar o contato");
      }

      ToastAndroid.show("Contato criado com sucesso", ToastAndroid.SHORT);
      setPhoneNumber("");
      setName("");
      numberInputRef.current?.focus();
    } catch (error: any) {
      console.error("Erro ao adicionar contato:", error.message);
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber === "") {
      numberInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
  }, []);

  return (
    <View style={[{ backgroundColor: colors.background }, styles.container]}>
      <View style={styles.containerInputs}>
        <TextInput
          ref={numberInputRef}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isFocusedPhone ? colors.primary : colors.gray,
            },
          ]}
          placeholder="Número"
          placeholderTextColor={colors.gray}
          selectionColor={colors.primary}
          onFocus={() => setIsFocusedPhone(true)}
          onBlur={() => setIsFocusedPhone(false)}
          returnKeyType="next"
          onSubmitEditing={() => nameInputRef.current?.focus()}
        />
        <TextInput
          ref={nameInputRef}
          value={name}
          onChangeText={setName}
          placeholder="Nome do contato"
          selectionColor={colors.primary}
          placeholderTextColor={colors.gray}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: isFocusedName ? colors.primary : colors.gray,
            },
          ]}
          onFocus={() => setIsFocusedName(true)}
          onBlur={() => setIsFocusedName(false)}
          returnKeyType="done"
          onSubmitEditing={handleAddContact}
        />
      </View>
      <View style={styles.containerButton}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? colors.backgroundButton : colors.primary },
          ]}
          disabled={!isFormValid || isLoading}
          onPress={handleAddContact}
        >
          {isLoading ? (
            <ActivityIndicator size={20} color={colors.text} />
          ) : (
            <Text style={{ color: colors.text, fontWeight: "bold" }}>Adicionar Contato</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  containerInputs: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  containerButton: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
