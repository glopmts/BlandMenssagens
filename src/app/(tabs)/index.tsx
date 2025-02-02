import { requestNotificationPermission, useRegisterPushToken } from "@/components/GetTokensNotifications";
import ContactsScreen from "@/components/ListContacts";
import MenssagensList from "@/components/ListMenssagens";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/utils/supabase";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Contacts from 'expo-contacts';
import { parsePhoneNumber } from "libphonenumber-js";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabOneScreen() {
  const { colors } = useTheme();
  const { isLoaded } = useUser();
  const { signOut } = useClerk();
  const { user } = useUser();

  useRegisterPushToken(user?.id!);

  useEffect(() => {
    const saveUserInfo = async () => {
      if (user) {
        const phoneNumber = user.phoneNumbers[0].phoneNumber;

        const phoneNumberFormatted = parsePhoneNumber(phoneNumber, "BR")?.format("E.164");

        if (phoneNumberFormatted) {
          const { data, error } = await supabase
            .from("users")
            .upsert({
              id: user.id,
              clerk_id: user.id,
              phone: phoneNumberFormatted,
            });

          if (error) {
            console.error("Erro ao salvar o usuário:", error.message);
          } else {
            console.log("Usuário salvo:", data);
          }
        } else {
          console.error("Erro ao formatar o número de telefone.");
        }
      }
    };

    saveUserInfo();
  }, [user]);


  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        Alert.alert('Atenção', 'Ative as notificações nas configurações do dispositivo.');
      }
    };
    checkPermissions();
  }, []);

  if (!isLoaded) {
    return (
      <View style={[styles.containerLoader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={30} color="#2563eb" />
      </View>
    );
  }

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MenssagensList />
      <ContactsScreen />
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={{ color: colors.text }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    gap: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 1,
  },
  containerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})

