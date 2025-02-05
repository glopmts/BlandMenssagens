import { Mensagens } from "@/types/interfaces";
import { url } from "@/utils/url-api";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import io from "socket.io-client";

const socket = io("http://192.168.18.8:5001");

export function useMessages(chatId: string, userId: string) {
  const [messages, setMessages] = useState<Mensagens[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on(`chat:${userId}`, (message: Mensagens) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(`chat:${chatId}`, (message: Mensagens) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off(`chat:${userId}`);
      socket.off(`chat:${chatId}`);
    };
  }, [userId, chatId]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${url}/api/user/menssagens/${userId}`);
        if (!res.ok) throw new Error("Erro ao buscar mensagens");
        const data = await res.json();
        const filteredMessages = data.map((msg: Mensagens) => ({
          ...msg,
          content: msg.is_deleted ? "" : msg.content,
        }));

        setMessages(filteredMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [userId]);

  const handleDeleteMessage = async (messageId: string, createdAt: string, userId: string) => {
    const messageTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - messageTime;
    const fiveMinutes = 5 * 60 * 1000;

    if (timeDifference < fiveMinutes) {
      Alert.alert(
        "Deletar Mensagem",
        "Esta mensagem será deletada para todos. Tem certeza?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            onPress: async () => {
              try {
                await fetch(`${url}/api/user/deleteMessagen`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ messageId, userId }),
                });
                ToastAndroid.show("Mensagem deletada com sucesso!", ToastAndroid.SHORT);
              } catch (err) {
                Alert.alert("Erro ao deletar mensagem");
                console.error("Erro deletando mensagem:", err);
              } finally {
                setMessages(messages.filter((msg) => msg.id !== messageId));
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Deletar Mensagem",
        "Esta mensagem será deletada apenas para você. Tem certeza?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            onPress: async () => {
              try {
                await fetch(`${url}/api/user/deleteMessagen`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ messageId, userId }),
                });
                ToastAndroid.show("Mensagem deletada com sucesso!", ToastAndroid.SHORT);
              } catch (err) {
                Alert.alert("Erro ao deletar mensagem");
                console.error("Erro deletando mensagem:", err);
              } finally {
                setMessages(messages.filter((msg) => msg.id !== messageId));
              }
            },
          },
        ]
      );
    }
  };

  const sendMessage = (content: string, legendImage: string, imageUrl: string[] = []) => {
    const newMessage: Mensagens = {
      id: Date.now().toString(),
      sender_id: chatId,
      receiver_id: userId,
      content,
      created_at: new Date().toISOString(),
      status: "send",
      legendImage: legendImage,
      is_deleted: false,
      images: imageUrl
    };
    socket.emit("send_message", newMessage);
  };

  return { messages, loading, sendMessage, handleDeleteMessage };
}
