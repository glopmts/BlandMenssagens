import ContactsScreen from "@/components/ListContacts";
import MenssagensList from "@/components/ListMenssagens";
import { useTheme } from "@/hooks/useTheme";
import { useClerk, useUser } from "@clerk/clerk-expo";
import * as Contacts from 'expo-contacts';
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

export default function TabOneScreen() {
  const { colors } = useTheme();
  const { isLoaded } = useUser();
  const { signOut } = useClerk()

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

  if (!isLoaded) {
    return (
      <View style={[styles.containerLoader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size={30} color="#2563eb" />
      </View>
    )
  }

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MenssagensList />
      <ContactsScreen />
    </View>
  )
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

