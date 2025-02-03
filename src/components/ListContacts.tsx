import { useTheme } from "@/hooks/useTheme"
import type { Contact } from "@/types/interfaces"
import { url } from "@/utils/url-api"
import { useUser } from "@clerk/clerk-expo"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
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
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadContacts = async (userId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`${url}/api/user/contacts/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        setError("Não foi possível buscar contatos.");
        throw new Error(data.message || "Erro ao buscar contatos.");
      }
      setContacts(data);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadContacts(user.id);
    }
  }, [user])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (user?.id) {
      loadContacts(user.id).finally(() => setRefreshing(false));
    }
  }, [user])

  const ContactListItem = ({ item, colors, router }: any) => {

    const lastSeenText = item?.lastOnline
      ? new Date(item.lastOnline).toLocaleString()
      : "Nunca visto"

    return (
      <TouchableOpacity
        style={[styles.contactItem, { backgroundColor: colors.cardColor }]}
        onPress={() => router.navigate(`/(pages)/menssagens/${item.contact_id}`)}
      >
        {item?.imageurl ? (
          <Image style={styles.contactImage} source={{ uri: item?.imageurl }} />
        ) : (
          <View style={[styles.contactImage, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 20 }}>{item?.name?.charAt(0)}</Text>
          </View>
        )}
        <View>
          <Text style={[styles.contactName, { color: colors.text }]}>{item?.name || "Nome não disponível"}</Text>
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
        renderItem={({ item }) => <ContactListItem router={router} item={item} colors={colors} />}
        ListHeaderComponent={() => <Text style={[styles.title, { color: colors.text }]}>Seus contatos salvos</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  )
}