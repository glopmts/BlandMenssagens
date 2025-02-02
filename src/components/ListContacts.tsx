import { useTheme } from "@/hooks/useTheme"
import type { Contact, User } from "@/types/interfaces"
import { supabase } from "@/utils/supabase"
import { useUser } from "@clerk/clerk-expo"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noContactsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noContactsText: {
    fontSize: 18,
    textAlign: "center",
  },
})


export default function ContactsScreen() {
  const { user } = useUser()
  const { colors } = useTheme()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadContactsFromSupabase = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", user.id)

      if (contactsError) throw contactsError

      setContacts(contactsData || [])

      if (contactsData && contactsData.length > 0) {
        const contactIds = contactsData.map((contact) => contact.contact_id)
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .in("clerk_id", contactIds)

        if (usersError) throw usersError

        setUsers(usersData || [])
      }
    } catch (err) {
      console.error("Error loading contacts:", err)
      setError("Erro ao carregar contatos. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContactsFromSupabase()
  }, [user])

  const ContactListItem = ({ item, users, colors, router }: any) => {
    const userContact = users.find((user: User) => user.clerk_id === item.contact_id)

    const lastSeenText = userContact?.lastOnline
      ? new Date(userContact.lastOnline).toLocaleString()
      : "Nunca visto"

    return (
      <TouchableOpacity
        style={[styles.contactItem, { backgroundColor: colors.cardColor }]}
        onPress={() => router.navigate(`/(pages)/menssagens/${item.id}`)}
      >
        {userContact?.image ? (
          <Image style={styles.contactImage} source={{ uri: userContact.image }} />
        ) : (
          <View style={[styles.contactImage, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{userContact?.name?.charAt(0)}</Text>
          </View>
        )}
        <View>
          <Text style={[styles.contactName, { color: colors.text }]}>{userContact?.name || "Nome não disponível"}</Text>
          <Text style={[styles.contactName, { color: colors.text }]}>{lastSeenText}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgroundColorContacts, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundColorContacts }]}>
        <Text style={{ color: colors.text }}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorContacts }]}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ContactListItem router={router} item={item} users={users} colors={colors} />}
        ListHeaderComponent={() => <Text style={[styles.title, { color: colors.text }]}>Seus contatos salvos</Text>}
      />
    </View>
  )
}

