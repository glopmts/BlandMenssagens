import { stylesListMenssagens } from "@/app/styles/ListMenssagens";
import { useTheme } from "@/hooks/useTheme";
import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

import io from "socket.io-client";
const socket = io("http://192.168.18.8:5001");


export default function MensagensList() {
  const { user } = useUser();
  const [mensagens, setMensagens] = useState<Mensagens[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

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

  useEffect(() => {
    if (user?.id) {
      fetchMensagens(user.id);
    }
  }, [user])


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
      <Image source={{ uri: contactImage }} style={stylesListMenssagens.contactImage} />
    ) : (
      <View style={[stylesListMenssagens.contactInitial, { backgroundColor: colors.primary }]}>
        <Text style={stylesListMenssagens.contactInitialText}>
          {contactName ? contactName.charAt(0).toUpperCase() : ""}
        </Text>
      </View>
    );

    return (
      <TouchableOpacity
        style={stylesListMenssagens.messagesItem}
        onPress={() => router.navigate(`/(pages)/menssagens/${contact.clerk_id}`)}
      >
        {renderImage}
        <View style={stylesListMenssagens.contaInfo}>
          <View style={stylesListMenssagens.namesDate}>
            <Text style={[stylesListMenssagens.contactName, { color: colors.text }]}>
              {contactName || "Name not found"}
            </Text>
            <Text style={stylesListMenssagens.lastSeen}>{lastSeenText}</Text>
          </View>
          <Text style={[stylesListMenssagens.messageText, { color: colors.text }]}>{item.content}</Text>
        </View>
      </TouchableOpacity>
    );
  }

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
    <View style={[stylesListMenssagens.container, { backgroundColor: colors.backgroundColorContacts }]}>
      {isLoading ? (
        <View style={stylesListMenssagens.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={mensagens}
          extraData={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[stylesListMenssagens.emptyText, { color: colors.text }]}>No messages yet!</Text>}
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


