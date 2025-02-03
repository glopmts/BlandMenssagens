import { useTheme } from "@/hooks/useTheme";
import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import io from "socket.io-client";
const socket = io("http://192.168.18.8:5001");


export default function MensagensList() {
  const { user } = useUser();
  const [mensagens, setMensagens] = useState<Mensagens[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (user?.id) {
      fetchMensagens(user.id);

      socket.on('send_message', (newMessage: Mensagens) => {
        setMensagens((prevMensagens) => {
          const chatId = newMessage.sender_id === user.id ? newMessage.receiver_id : newMessage.sender_id;

          const existingMessageIndex = prevMensagens.findIndex(
            (msg) => (msg.sender_id === chatId || msg.receiver_id === chatId)
          );

          if (existingMessageIndex !== -1) {
            const updatedMessages = [...prevMensagens];
            updatedMessages[existingMessageIndex] = newMessage;
            return updatedMessages;
          } else {
            return [newMessage, ...prevMensagens];
          }
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('send_message');
        socket.disconnect();
      }
    };
  }, [user?.id]);

  const fetchMensagens = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/api/user/recipeMenssagens/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar mensagens.");
      }

      const mensagensFormatadas = data.map((mensagem: any) => ({
        ...mensagem,
        id: mensagem.id.toString(),
        sender_id: mensagem.sender_id.toString(),
        receiver_id: mensagem.receiver_id.toString(),
      }));

      const groupedMessages = groupMessagesByContact(mensagensFormatadas);
      setMensagens(groupedMessages);
      return mensagensFormatadas;
    } catch (error: any) {
      Alert.alert("Erro", error.message);
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMensagens(user?.id!);
  }, [fetchMensagens]);


  const renderItem = ({ item }: { item: Mensagens }) => (
    <ListMensagens item={item} colors={colors} />
  );

  const groupMessagesByContact = (messages: Mensagens[]) => {
    const groupedMessages: { [key: string]: Mensagens } = {};

    messages.forEach((message) => {
      const chatId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;

      if (!groupedMessages[chatId] || new Date(message.created_at) > new Date(groupedMessages[chatId].created_at)) {
        groupedMessages[chatId] = message;
      }
    });

    return Object.values(groupedMessages);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColorContacts }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={mensagens}
          extraData={mensagens}
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
  );
}

function ListMensagens({ item, colors }: { item: Mensagens; colors: any }) {
  const { user } = useUser();
  const lastSeenText = item.created_at
    ? new Date(item.created_at).toLocaleString()
    : "Never seen";

  const isSender = item.sender_id === user?.id;
  const contact = isSender ? item.receiver : item.sender;
  const contactImage = contact.imageurl;
  const contactName = contact.name;

  const renderImage = contactImage ? (
    <Image source={{ uri: contactImage }} style={styles.contactImage} />
  ) : (
    <View style={[styles.contactInitial, { backgroundColor: colors.primary }]}>
      <Text style={styles.contactInitialText}>
        {contactName ? contactName.charAt(0).toUpperCase() : ""}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.messagesItem}
      onPress={() => router.navigate(`/(pages)/menssagens/${contact.clerk_id}`)}
    >
      {renderImage}
      <View style={styles.contaInfo}>
        <View style={styles.namesDate}>
          <Text style={[styles.contactName, { color: colors.text }]}>
            {contactName || "Name not found"}
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
  },
});
