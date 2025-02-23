import { stylesListMenssagens } from "@/app/styles/ListMenssagens";
import { useTheme } from "@/hooks/useTheme";
import { socket } from "@/server/socket-io";
import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function MensagensList() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [mensagens, setMensagens] = useState<Mensagens[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const { error, isLoading, refetch } = useQuery({
    queryKey: ['mensagens', userId],
    queryFn: async () => {
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
          contact_name: mensagem.contact_name,
        }));
        const groupedMessages = groupMessagesByContact(mensagensFormatadas);
        setMensagens(groupedMessages);
        return data;
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as mensagens", [
          { text: "OK", onPress: () => { } },
        ]);
        return [];
      }
    },
    enabled: !!userId,
    refetchInterval: 10000,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (!userId) return;
    refetch();
    socket.on(`chat:${userId}`, (novaMensagem: Mensagens) => {
      setMensagens((mensagensAtuais) => {
        const mensagensAtualizadas = [...mensagensAtuais, novaMensagem];
        return groupMessagesByContact(mensagensAtualizadas);
      });
    });
    return () => {
      socket.off(`chat:${userId}`);
    };
  }, [userId]);

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

  const renderItem = ({ item }: { item: Mensagens }) => (
    <ListMensagens item={item} colors={colors} />
  );

  return (
    <View style={[stylesListMenssagens.container, { backgroundColor: colors.backgroundColorContacts }]}>
      {isLoading ? (
        <View style={stylesListMenssagens.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[stylesListMenssagens.emptyText, { color: colors.text }]}>Sem mensagens até o momento!</Text>}
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

interface ListMensagensProps {
  item: Mensagens
  colors: any
}


function ListMensagens({ item, colors }: ListMensagensProps) {
  const { user } = useUser()
  const lastSeenText = item.created_at ? new Date(item.created_at).toLocaleString() : "Never seen"
  const isSenderLoggedUser = item.sender_id === user?.id
  const otherUser = isSenderLoggedUser ? item.receiver : item.sender

  const contactImage = otherUser?.imageurl ?? ''
  const contactName = item.contact_name || "Unknown"

  const renderContactImage = () => {
    if (contactImage) {
      return <Image source={{ uri: contactImage }} style={stylesListMenssagens.contactImage} />
    } else {
      const initial = contactName.charAt(0).toUpperCase()
      return (
        <View style={[stylesListMenssagens.contactInitial, { backgroundColor: colors.primary }]}>
          <Text style={stylesListMenssagens.contactInitialText}>{initial}</Text>
        </View>
      )
    }
  }

  return (
    <TouchableOpacity
      style={stylesListMenssagens.messagesItem}
      onPress={() => router.navigate(`/(pages)/menssagens/${otherUser.search_token}`)}
    >
      {renderContactImage()}
      <View style={stylesListMenssagens.contaInfo}>
        <View style={stylesListMenssagens.namesDate}>
          <Text style={[stylesListMenssagens.contactName, { color: colors.text }]}>{contactName}</Text>
          <Text style={stylesListMenssagens.lastSeen}>{lastSeenText}</Text>
        </View>
        {item.content && item.content.trim() !== "" ? (
          <Text dataDetectorType="all" numberOfLines={2} style={[stylesListMenssagens.messageText, { color: colors.text }]}>
            {item.content}
          </Text>
        ) : item.legendImage && item.legendImage.trim() !== "" ? (
          <Text dataDetectorType="all" numberOfLines={2} style={[stylesListMenssagens.messageText, { color: colors.text }]}>
            {item.legendImage}
          </Text>
        ) : item.filesUrls && Array.isArray(item.filesUrls) && item.filesUrls.length > 0 ? (
          <View style={stylesListMenssagens.imagePlaceholder}>
            <Ionicons name="file-tray" size={14} color={colors.text} />
            <Text style={stylesListMenssagens.imagePlaceholderText}>Arquivo</Text>
          </View>
        ) : item.audioUrl && item.audioUrl.trim() !== "" ? (
          <View style={stylesListMenssagens.imagePlaceholder}>
            <Icon name="volume-up" size={14} color={colors.text} />
            <Text style={stylesListMenssagens.imagePlaceholderText}>Enviou um áudio</Text>
          </View>
        ) : item.images ? (
          <View style={stylesListMenssagens.imagePlaceholder}>
            <Icon name="image" size={14} color={colors.text} />
            <Text style={stylesListMenssagens.imagePlaceholderText}>Foto</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}
