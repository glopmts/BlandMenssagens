import { useTheme } from "@/hooks/useTheme"
import type { Mensagens } from "@/types/interfaces"
import { supabase } from "@/utils/supabase"
import { useUser } from "@clerk/clerk-expo"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MensagensList() {
  const { user } = useUser()
  const [mensagens, setMensagens] = useState<Mensagens[]>([])
  const [isLoading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { colors } = useTheme()

  useEffect(() => {
    if (user?.id) {
      fetchMensagens()
    }
  }, [user?.id])

  const fetchMensagens = async () => {
    try {
      const { data: existingMensagens, error } = await supabase
        .from("messages")
        .select("*")
        .or(`receiver_id.eq.${user?.id},sender_id.eq.${user?.id}`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching messages:", error.message)
        return
      }

      const mensagensComIdsComoString = existingMensagens?.map((mensagem) => ({
        ...mensagem,
        id: mensagem.id.toString(),
        sender_id: mensagem.sender_id.toString(),
        receiver_id: mensagem.receiver_id.toString(),
      }))

      setMensagens(mensagensComIdsComoString || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchMensagens()
  }, [fetchMensagens]) // Added fetchMensagens to dependencies

  const renderItem = ({ item }: { item: Mensagens }) => (
    <ListMensagens item={item} colors={colors} contacts={mensagens} />
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorContacts }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.text }]}>No messages yet!</Text>}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  )
}

function ListMensagens({ item, colors, contacts }: { item: Mensagens; colors: any; contacts: Mensagens[] }) {
  const lastSeenText = item.created_at ? new Date(item.created_at).toLocaleString() : "Never seen"

  return (
    <TouchableOpacity style={styles.messagesItem} onPress={() => router.navigate(`/(pages)/menssagens/${item.sender_id}`)}>
      {item.contact_phone ? (
        <Image
          source={{ uri: `https://api.dicebear.com/6.x/initials/png?seed=${item.contact_name}` }}
          style={styles.contactImage}
        />
      ) : (
        <View style={[styles.contactInitial, { backgroundColor: colors.primary }]}>
          <Text style={styles.contactInitialText}>
            {item.contact_name ? item.contact_name.charAt(0).toUpperCase() : ""}
          </Text>
        </View>
      )}
      <View style={styles.contaInfo}>
        <View style={styles.namesDate}>
          <Text style={[styles.contactName, { color: colors.text }]}>{item.contact_name || "Name not found"}</Text>
          <Text style={styles.lastSeen}>{lastSeenText}</Text>
        </View>
        <Text style={[styles.messageText, { color: colors.text }]}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 5,
  },
  messagesItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
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
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 20,
    maxWidth: 200,
  },
  namesDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,

  }
})

