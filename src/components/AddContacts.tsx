import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/utils/supabase";
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
import { normalizePhoneNumber } from "./normNumber";

export default function AddContacts() {
  const { user } = useUser();
  const { colors } = useTheme();

  const numberInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);
  const [isFocusedPhone, setIsFocusedPhone] = useState(false);
  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const isFormValid = phoneNumber.trim() !== "" && name.trim() !== "";

  const handleAddContact = async () => {
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);

      const { data: existingContact, error: contactError } = await supabase
        .from("contacts")
        .select("id")
        .eq("phone", normalizedPhone)
        .eq("user_id", user?.id)
        .single();

      if (contactError && contactError.code !== "PGRST116") {
        throw contactError;
      }

      if (existingContact) {
        Alert.alert("Erro", "Esse contato já está salvo na sua lista.");
        setIsLoading(false);
        return;
      }

      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("id, imageurl")
        .eq("phone", normalizedPhone)
        .single();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      const { data, error } = await supabase
        .from("contacts")
        .insert({
          user_id: user?.id,
          contact_id: existingUser?.id,
          clerk_id: existingUser?.id,
          phone: normalizedPhone,
          name,
          image: existingUser?.imageurl
        });

      if (error) {
        throw error;
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
