import { fetchContacts, getContactsUser, saveContactsToDatabase } from "@/hooks/contactsUser"
import { useTheme } from "@/hooks/useTheme"
import type { Contact, User } from "@/types/interfaces"
import { useClerk } from "@clerk/clerk-expo"
import { Image } from "expo-image"
import { Router, useRouter } from "expo-router"
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useClerk()
  const { colors } = useTheme()
  const router = useRouter()

  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedContacts = await fetchContacts()
      setContacts(fetchedContacts)
      setIsSaving(true)
      await saveContactsToDatabase(fetchedContacts, user?.id)
      const fetchedUsers = await getContactsUser(fetchedContacts)
      setUsers(fetchedUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadContacts}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorContacts }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactListItem router={router} item={item} contacts={contacts} colors={colors} />}
        ListHeaderComponent={() => (
          <Text style={[styles.title, { color: colors.text }]}>Seus contatos salvos</Text>
        )}
        ListFooterComponent={() => (
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Loading contacts...</Text>
            </View>
          ) : null
        )}
      />
    </View>
  )
}

function ContactListItem({ item, contacts, colors, router }: { item: User; contacts: Contact[]; colors: any, router: Router }) {
  const lastSeenText = item.last_seen ? new Date(item.last_seen).toLocaleString() : "Never seen"

  const contact = contacts.find((contact) => {
    const phone = contact.phoneNumbers?.[0]?.number?.replace(/\D/g, "")
    return phone === item.phone
  })

  return (
    <TouchableOpacity style={styles.contactItem} onPress={() => router.navigate(`/(pages)/menssagens/${item.clerk_id}`)}>
      {item.imageurl ? (
        <Image source={{ uri: item.imageurl }} style={styles.contactImage} />
      ) : (
        <View style={[styles.contactInitial, { backgroundColor: colors.primary }]}>
          <Text style={styles.contactInitialText}>
            {contact?.name ? contact.name.charAt(0).toUpperCase() : ""}
          </Text>
        </View>
      )}
      <View style={styles.contaInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{contact?.name || "Name not found"}</Text>
        <Text style={styles.lastSeen}>Last seen: {lastSeenText}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
  },
  savingIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    zIndex: 1,
  },
  savingText: {
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    padding: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  contactInitialText: {
    color: "white",
    fontSize: 24,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },
  lastSeen: {
    color: "gray",
    fontSize: 12,
  },
  contaInfo: {
    display: 'flex',
    justifyContent: "space-between",
    flexDirection: 'column',
  }
})
