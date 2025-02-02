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
  const { colors } = useTheme();

  useEffect(() => {
    if (user?.id) {
      fetchMensagens()
    }
  }, [user?.id])

  const fetchMensagens = async () => {
    try {
      const { data: existingMensagens, error } = await supabase
        .from("messages")
        .select("*, sender_id, receiver_id, created_at")
        .or(`receiver_id.eq.${user?.id},sender_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error.message);
        return;
      }

      const userIds = [
        ...new Set(existingMensagens?.map((msg) => msg.sender_id).concat(existingMensagens?.map((msg) => msg.receiver_id)))
      ];

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .in("clerk_id", userIds);

      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .in("clerk_id", userIds);

      if (usersError || contactsError) {
        console.error("Error fetching users or contacts:", usersError?.message || contactsError?.message);
        return;
      }

      const usersMap = new Map();
      usersData?.forEach((user) => {
        usersMap.set(user.clerk_id, user);
      });

      const contactsMap = new Map();
      contactsData?.forEach((contact) => {
        contactsMap.set(contact.clerk_id, contact);
      });

      const uniqueChats = new Map();
      existingMensagens?.forEach((msg) => {
        const chatKey = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;

        if (!uniqueChats.has(chatKey)) {
          const contact = contactsMap.get(chatKey);
          const user = usersMap.get(chatKey);

          uniqueChats.set(chatKey, {
            ...msg,
            contact_name: contact?.name || user?.name,
            contact_image: contact?.image || user?.imageurl,
          });
        }
      });

      const mensagensFormatadas = Array.from(uniqueChats.values()).map((mensagem) => ({
        ...mensagem,
        id: mensagem.id.toString(),
        sender_id: mensagem.sender_id.toString(),
        receiver_id: mensagem.receiver_id.toString(),
      }));

      setMensagens(mensagensFormatadas);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchMensagens()
  }, [fetchMensagens])

  const renderItem = ({ item }: { item: Mensagens }) => (
    <ListMensagens item={item} colors={colors} />
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

function ListMensagens({ item, colors }: { item: Mensagens; colors: any, }) {
  const { user } = useUser();
  const lastSeenText = item.created_at
    ? new Date(item.created_at).toLocaleString()
    : "Never seen";

  const chatId = item.sender_id === user?.id ? item.receiver_id : item.sender_id;
  const contactImage = item.contact_image;

  const renderImage = contactImage ? (
    <Image source={{ uri: contactImage }} style={styles.contactImage} />
  ) : (
    <View style={[styles.contactInitial, { backgroundColor: colors.primary }]}>
      <Text style={styles.contactInitialText}>
        {item.contact_name ? item.contact_name.charAt(0).toUpperCase() : ""}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.messagesItem}
      onPress={() => router.navigate(`/(pages)/menssagens/${chatId}`)}
    >
      {renderImage}
      <View style={styles.contaInfo}>
        <View style={styles.namesDate}>
          <Text style={[styles.contactName, { color: colors.text }]}>
            {item.contact_name || "Name not found"}
          </Text>
          <Text style={styles.lastSeen}>{lastSeenText}</Text>
        </View>
        <Text style={[styles.messageText, { color: colors.text }]}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );
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

