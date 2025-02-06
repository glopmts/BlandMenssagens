import { deleteOldAudio, deleteOldImage } from "@/types/deleteImagemFirebase";
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

        const filteredMessages = data.filter((msg: Mensagens) => {
          if (msg.hidden_by_sender && msg.sender_id === userId) return false;
          if (msg.hidden_by_receiver && msg.receiver_id === userId) return false;
          return true;
        });

        setMessages(filteredMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [userId]);


  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await fetch(`${url}/api/user/updateMessageStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, userId, status }),
      });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  }

  const handleDeleteMessage = async (messageId: string, createdAt: string, userId: string, audioUrl?: string, images: string[] = []) => {
    const messageTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - messageTime;
    const fiveMinutes = 5 * 60 * 1000;

    const deleteImages = async () => {
      if (images.length > 0) {
        await Promise.all(images.map((url) => deleteOldImage(url)));
      }
    };

    const deleteAudio = async () => {
      if (audioUrl) {
        await deleteOldAudio(audioUrl);
      }
    };

    Alert.alert(
      "Deletar Mensagem",
      timeDifference < fiveMinutes
        ? "Esta mensagem será deletada para todos. Tem certeza?"
        : "Esta mensagem será deletada apenas para você. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          onPress: async () => {
            try {
              await deleteImages();
              await deleteAudio();

              await fetch(`${url}/api/user/deleteMessagen`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ messageId, userId }),
              });

              ToastAndroid.show("Mensagem deletada com sucesso!", ToastAndroid.SHORT);
              setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            } catch (err) {
              Alert.alert("Erro ao deletar mensagem");
              console.error("Erro deletando mensagem:", err);
            }
          },
        },
      ]
    );
  };

  const sendMessage = (content: string, legendImage: string, imageUrl: string[] = [], audioUrl?: string) => {
    const newMessage: Mensagens = {
      id: Date.now().toString(),
      sender_id: chatId,
      receiver_id: userId,
      content,
      created_at: new Date().toISOString(),
      status: "send",
      legendImage: legendImage,
      is_deleted: false,
      images: imageUrl,
      audioUrl: audioUrl
    };
    socket.emit("send_message", newMessage);
  };


  return { messages, loading, sendMessage, handleDeleteMessage, updateMessageStatus };
}

export const handleClearMenssagens = async (userId: string, chatWith: string) => {
  try {
    await fetch(`${url}/api/user/clearChatForUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, chatWith }),
    });
    ToastAndroid.show("Mensagens limpas com sucesso!", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
}


export const handleChatUser = async (userId: string, chatWith: string) => {
  try {
    await fetch(`${url}/api/user/deleteChatUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, chatWith }),
    });
    ToastAndroid.show("Mensagens limpas com sucesso!", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error clearing messages:", error);
  }
}
